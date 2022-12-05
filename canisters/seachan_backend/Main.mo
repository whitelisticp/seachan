import Array "mo:base/Array";
import AssocList "mo:base/AssocList";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Map "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Prim "mo:prim";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import Types "./Types";
import Utils "./Utils";

actor Seachan {

  // boards
  private var boardStore : HashMap.HashMap<Text, Types.Board> = HashMap.HashMap<Text, Types.Board>(10, Text.equal, Text.hash);
  private stable var boardEntries : [(Text, Types.Board)] = [];

  public query func getBoardCount() : async Nat { boardStore.size() };

  public query func getBoard(key : Text) : async Result.Result<Types.Board, Types.Error> {
    let entry : ?Types.Board = boardStore.get(key);
    let exists = Option.isSome(entry);
    switch (entry) {
      case (?exists) { #ok(exists) };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func deleteBoard(key : Text) : async Result.Result<Types.Board, Types.Error> {
    assert Utils.isAdmin(caller);

    let entry : ?Types.Board = boardStore.get(key);
    let entryExists = Option.isSome(entry);
    switch (entry) {
      case (?entry) {
        boardStore.delete(entry.abbreviation);
        #ok(entry)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func deleteAllBoards() : async Result.Result<Text, Types.Error> {
    assert Utils.isAdmin(caller);

    let keys = boardStore.keys();
    for (key in keys) { boardStore.delete(key) };
    let postKeys = postStore.keys();
    for (postKey in postKeys) {
      postStore.delete(postKey)
    };
    #ok("Deleted all boards and posts")
  };

  public query ({ caller }) func listBoards() : async Result.Result<[Types.Board], Types.Error> {
    assert Utils.isAdmin(caller);
    let entries : Iter.Iter<(Text, Types.Board)> = boardStore.entries();
    let iter : Iter.Iter<Types.Board> = Iter.map(entries, func((key : Text, value : Types.Board)) : Types.Board { value });
    #ok(Iter.toArray(iter))
  };

  public query ({ caller }) func getListedBoards() : async Result.Result<[Types.Board], Types.Error> {
    let entries : Iter.Iter<(Text, Types.Board)> = boardStore.entries();
    let iter : Iter.Iter<Types.Board> = Iter.map(entries, func((key : Text, value : Types.Board)) : Types.Board { value });
    let arrayFiltered = Array.filter(Iter.toArray(iter), func(v : Types.Board) : Bool { v.listed == true });
    #ok(arrayFiltered)
  };

  public query func boardExists(abbreviation : Text) : async Bool {
    let entry : ?Types.Board = boardStore.get(abbreviation);
    Option.isSome(entry)
  };

  public shared ({ caller }) func createBoard(inBoard : Types.BoardCreate) : async Result.Result<Types.Board, Types.Error> {
    assert Utils.isAdmin(caller);
    if (await boardExists(inBoard.abbreviation)) {
      return #err(#AlreadyExists)
    };
    var newBoard = {
      abbreviation = inBoard.abbreviation;
      name = inBoard.name;
      timeStamp = Time.now();
      latestActivityTimeStamp = Time.now();
      ownerPrincipal = caller;
      nextPostId = 0;
      threadCount = 0;
      postCount = 0;
      showFlags = inBoard.showFlags;
      textOnly = inBoard.textOnly;
      forceAnonymity = inBoard.forceAnonymity;
      gated = inBoard.gated;
      gateType = inBoard.gateType;
      gateToken = inBoard.gateToken;
      gateTokenAmount = inBoard.gateTokenAmount;
      listed = inBoard.listed;
      inDevelopment = inBoard.inDevelopment;
      allFileCount = 0;
      allFileSize = 0;
      posts = []
    } : Types.Board;
    boardStore.put(inBoard.abbreviation, newBoard);
    #ok(newBoard)
  };

  public shared query func getNextPostId(abbreviation : Text) : async Nat32 {
    let entry : ?Types.Board = boardStore.get(abbreviation);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        exists.nextPostId + 1
      };
      case (null) { 0 }
    }
  };

  func incrementBoardNextPostId(abbreviation : Text, isImport : Bool, saged : Bool) : async Result.Result<Types.Board, Types.Error> {
    let entry : ?Types.Board = boardStore.get(abbreviation);
    let exists = Option.isSome(?entry);
    var increment = 0 : Nat32;
    if (isImport) {
      increment := 0 : Nat32
    } else {
      increment := 1 : Nat32
    };
    switch (entry) {
      case (?exists) {

        let latestActivityTimeStamp = if (saged) {
          exists.latestActivityTimeStamp
        } else { Time.now() };

        var updatedBoard = {
          abbreviation = exists.abbreviation : Text;
          name = exists.name : Text;
          timeStamp = exists.timeStamp : Int;
          latestActivityTimeStamp = latestActivityTimeStamp : Int;
          ownerPrincipal = exists.ownerPrincipal : Principal;
          nextPostId = exists.nextPostId + increment : Nat32;
          threadCount = exists.threadCount : Nat32;
          postCount = exists.postCount + increment : Nat32;
          showFlags = exists.showFlags : Bool;
          textOnly = exists.textOnly : Bool;
          forceAnonymity = exists.forceAnonymity : Bool;
          gated = exists.gated : Bool;
          gateType = exists.gateType : Text;
          gateToken = exists.gateToken : Text;
          gateTokenAmount = exists.gateTokenAmount : Nat32;
          listed = exists.listed : Bool;
          inDevelopment = exists.inDevelopment : Bool;
          allFileCount = exists.allFileCount : Nat32;
          allFileSize = exists.allFileSize : Int;
          posts = exists.posts : [Nat32]
        } : Types.Board;
        boardStore.put(updatedBoard.abbreviation, updatedBoard);
        #ok(updatedBoard)
      };
      case (null) { #err(#NotFound) }
    }
  };

  func addThreadToBoard(abbreviation : Text, threadId : Nat32, isImport : Bool, saged : Bool) : async Result.Result<Types.Board, Types.Error> {
    let entry : ?Types.Board = boardStore.get(abbreviation);
    let exists = Option.isSome(?entry);
    var increment = 0 : Nat32;
    if (isImport) {
      increment := 0 : Nat32
    } else {
      increment := 1 : Nat32
    };
    switch (entry) {
      case (?exists) {

        let latestActivityTimeStamp = if (saged) {
          exists.latestActivityTimeStamp
        } else { Time.now() };

        let postBuffer : Buffer.Buffer<Nat32> = Buffer.fromArray<Nat32>(exists.posts);
        postBuffer.add(threadId);

        var updatedBoard = {
          abbreviation = exists.abbreviation : Text;
          name = exists.name : Text;
          timeStamp = exists.timeStamp : Int;
          latestActivityTimeStamp = latestActivityTimeStamp : Int;
          ownerPrincipal = exists.ownerPrincipal : Principal;
          nextPostId = exists.nextPostId + increment : Nat32;
          threadCount = exists.threadCount + increment : Nat32;
          postCount = exists.postCount + increment : Nat32;
          showFlags = exists.showFlags : Bool;
          textOnly = exists.textOnly : Bool;
          forceAnonymity = exists.forceAnonymity : Bool;
          gated = exists.gated : Bool;
          gateType = exists.gateType : Text;
          gateToken = exists.gateToken : Text;
          gateTokenAmount = exists.gateTokenAmount : Nat32;
          listed = exists.listed : Bool;
          inDevelopment = exists.inDevelopment : Bool;
          allFileCount = exists.allFileCount : Nat32;
          allFileSize = exists.allFileSize : Int;
          posts = postBuffer.toArray() : [Nat32]
        } : Types.Board;
        boardStore.put(updatedBoard.abbreviation, updatedBoard);
        #ok(updatedBoard)
      };
      case (null) { #err(#NotFound) }
    }
  };

  // posts
  private var postStore : HashMap.HashMap<Text, Types.Post> = HashMap.HashMap<Text, Types.Post>(10, Text.equal, Text.hash);
  private stable var postEntries : [(Text, Types.Post)] = [];

  public query func getPostCount() : async Nat { postStore.size() };

  public shared ({ caller }) func createThread(inThread : Types.PostCreate) : async Result.Result<Types.Post, Types.Error> {
    let user : ?Types.User = userStore.get(caller);
    let userExists = Option.isSome(?user);
    switch (user) {
      case (?userExists) {
        assert not userExists.blackListed
      };
      case (null) {}
    };

    let boardEntry : ?Types.Board = boardStore.get(inThread.boardAbbreviation);
    let boardExists = Option.isSome(?boardEntry);

    switch (boardEntry) {
      case (?boardExists) {
        var fileCount = 0 : Nat32;
        if (inThread.filePath != "") {
          fileCount := fileCount + 1
        };

        let nextPostId = await getNextPostId(inThread.boardAbbreviation);
        let threadKey = inThread.boardAbbreviation # "/" #Nat32.toText(nextPostId);
        var newThread = {
          id = nextPostId;
          threadKey = threadKey;
          boardAbbreviation = inThread.boardAbbreviation;
          ownerPrincipal = caller;
          icpBalance = inThread.icpBalance;
          icpReceived = 0.00;
          acceptTips = inThread.acceptTips;
          posterId = inThread.posterId;
          threadPosterIds = [inThread.posterId];
          siteAnonId = inThread.siteAnonId;
          threadAnonId = inThread.threadAnonId;
          subject = inThread.subject;
          body = inThread.body;
          stickied = inThread.stickied;
          locked = inThread.locked;
          flagged = false;
          hidden = false;
          saged = inThread.saged;
          op = true;
          posterIdColor = inThread.posterIdColor;
          timeStamp = Time.now() : Int;
          latestActivityTimeStamp = Time.now() : Int;
          reportCount = 0 : Nat32;
          reporterPrincipals = [] : [Principal];
          tags = [] : [Types.TagSummary];
          replies = [];
          replyCount = 0 : Nat32;
          mentions = inThread.mentions;
          mentionedBy = [];
          fileCount = fileCount : Nat32;
          filePath = inThread.filePath;
          fileNsfw = inThread.fileNsfw;
          fileType = inThread.fileType;
          fileExtension = inThread.fileExtension;
          fileName = inThread.fileName;
          fileSize = inThread.fileSize
        } : Types.Post;
        postStore.put(threadKey, newThread);
        var resultUpdateMentionedBy : [Text] = await updateMentionedBy(newThread.boardAbbreviation, newThread.id, newThread.mentions);
        var resultAddThreadToBoard : Result.Result<Types.Board, Types.Error> = await addThreadToBoard(newThread.boardAbbreviation, newThread.id, false, newThread.saged);
        #ok(newThread)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public query func listThreads(boardAbbreviation : Text) : async [Types.Post] {
    let boardEntry : ?Types.Board = boardStore.get(boardAbbreviation);
    let boardExists = Option.isSome(?boardEntry);
    switch (boardEntry) {
      case (?boardExists) {
        let boardThreads = boardExists.posts;
        let threadBuffer : Buffer.Buffer<Types.Post> = Buffer.Buffer(boardThreads.size());
        for (thread in Iter.fromArray(boardThreads)) {
          let foundThread = postStore.get(boardExists.abbreviation # "/" #Nat32.toText(thread));
          let foundThreadExists = Option.isSome(foundThread);
          switch (foundThread) {
            case (?foundThreadExists) {
              threadBuffer.add(foundThreadExists)
            };
            case (null) {}
          }
        };
        threadBuffer.toArray()
      };
      case (null) { [] }
    }
  };

  public query ({ caller }) func listPosts() : async Result.Result<[Types.Post], Types.Error> {
    assert Utils.isAdmin(caller);
    let entries : Iter.Iter<(Text, Types.Post)> = postStore.entries();
    let iter : Iter.Iter<Types.Post> = Iter.map(entries, func((key : Text, value : Types.Post)) : Types.Post { value });
    #ok(Iter.toArray(iter))
  };

  public query ({ caller }) func getPost(postKey : Text) : async Result.Result<Types.Post, Types.Error> {
    let post : ?Types.Post = postStore.get(postKey);
    let postExists = Option.isSome(?post);
    switch (post) {
      case (?postExists) {
        #ok(postExists)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func syncThreadFileCount() : async Result.Result<Text, Types.Error> {
    assert Utils.isAdmin(caller);

    let allPosts : Iter.Iter<(Text, Types.Post)> = postStore.entries();
    let allPostsIter : Iter.Iter<Types.Post> = Iter.map(allPosts, func((key : Text, value : Types.Post)) : Types.Post { value });
    let threads = Array.filter(Iter.toArray(allPostsIter), func(v : Types.Post) : Bool { v.op == true });

    for (thread in Iter.fromArray(threads)) {

      var fileCount = 0 : Nat32;

      if (thread.filePath != "") {
        fileCount += 1
      };

      for (replyId in Iter.fromArray(thread.replies)) {
        let replyObj : ?Types.Post = postStore.get(thread.boardAbbreviation # "/" # Nat32.toText(replyId));
        let replyExists = Option.isSome(?replyObj);
        switch (replyObj) {
          case (?replyExists) {
            if (replyExists.fileName != "") {
              fileCount += 1
            }
          };
          case (null) { fileCount += 0 }
        }
      };

      var updatedThread = {
        id = thread.id;
        threadKey = thread.threadKey;
        boardAbbreviation = thread.boardAbbreviation;
        ownerPrincipal = thread.ownerPrincipal;
        icpBalance = thread.icpBalance;
        icpReceived = thread.icpReceived;
        acceptTips = thread.acceptTips;
        posterId = thread.posterId;
        threadPosterIds = thread.threadPosterIds;
        siteAnonId = thread.siteAnonId;
        threadAnonId = thread.threadAnonId;
        subject = thread.subject;
        body = thread.body;
        stickied = thread.stickied;
        locked = thread.locked;
        flagged = thread.flagged;
        hidden = thread.hidden;
        saged = thread.saged;
        op = thread.op;
        posterIdColor = thread.posterIdColor;
        timeStamp = thread.timeStamp;
        latestActivityTimeStamp = thread.latestActivityTimeStamp;
        reportCount = thread.reportCount;
        reporterPrincipals = thread.reporterPrincipals;
        tags = thread.tags;
        replies = thread.replies;
        replyCount = thread.replyCount;
        mentions = thread.mentions;
        mentionedBy = thread.mentionedBy;
        fileCount = fileCount;
        filePath = thread.filePath;
        fileNsfw = thread.fileNsfw;
        fileType = thread.fileType;
        fileExtension = thread.fileExtension;
        fileName = thread.fileName;
        fileSize = thread.fileSize
      } : Types.Post;

      let postKey = updatedThread.boardAbbreviation # "/" #Nat32.toText(updatedThread.id);
      postStore.put(postKey, updatedThread)
    };

    #ok("Synced File Counts")
  };

  public shared ({ caller }) func syncPosterIdCount() : async Result.Result<Text, Types.Error> {
    assert Utils.isAdmin(caller);

    let allPosts : Iter.Iter<(Text, Types.Post)> = postStore.entries();
    let allPostsIter : Iter.Iter<Types.Post> = Iter.map(allPosts, func((key : Text, value : Types.Post)) : Types.Post { value });
    let threads = Array.filter(Iter.toArray(allPostsIter), func(v : Types.Post) : Bool { v.op == true });

    for (thread in Iter.fromArray(threads)) {

      let posterIdsBuffer : Buffer.Buffer<Types.PosterId> = Buffer.fromArray(thread.threadPosterIds);

      for (replyId in Iter.fromArray(thread.replies)) {
        let replyObj : ?Types.Post = postStore.get(thread.boardAbbreviation # "/" # Nat32.toText(replyId));
        let replyExists = Option.isSome(?replyObj);
        switch (replyObj) {
          case (?replyExists) {
            let matchBuffer : Buffer.Buffer<Types.PosterId> = Buffer.fromArray(Array.filter(posterIdsBuffer.toArray(), func(v : Types.PosterId) : Bool { v == replyExists.posterId }));
            if (matchBuffer.size() == 0) {
              posterIdsBuffer.add(replyExists.posterId)
            }
          };
          case (null) {}
        }
      };

      var updatedThread = {
        id = thread.id;
        threadKey = thread.threadKey;
        boardAbbreviation = thread.boardAbbreviation;
        ownerPrincipal = thread.ownerPrincipal;
        icpBalance = thread.icpBalance;
        icpReceived = thread.icpReceived;
        acceptTips = thread.acceptTips;
        posterId = thread.posterId;
        threadPosterIds = posterIdsBuffer.toArray();
        siteAnonId = thread.siteAnonId;
        threadAnonId = thread.threadAnonId;
        subject = thread.subject;
        body = thread.body;
        stickied = thread.stickied;
        locked = thread.locked;
        flagged = thread.flagged;
        hidden = thread.hidden;
        saged = thread.saged;
        op = thread.op;
        posterIdColor = thread.posterIdColor;
        timeStamp = thread.timeStamp;
        latestActivityTimeStamp = thread.latestActivityTimeStamp;
        reportCount = thread.reportCount;
        reporterPrincipals = thread.reporterPrincipals;
        tags = thread.tags;
        replies = thread.replies;
        replyCount = thread.replyCount;
        mentions = thread.mentions;
        mentionedBy = thread.mentionedBy;
        fileCount = thread.fileCount;
        filePath = thread.filePath;
        fileNsfw = thread.fileNsfw;
        fileType = thread.fileType;
        fileExtension = thread.fileExtension;
        fileName = thread.fileName;
        fileSize = thread.fileSize
      } : Types.Post;

      let postKey = updatedThread.boardAbbreviation # "/" #Nat32.toText(updatedThread.id);
      postStore.put(postKey, updatedThread)
    };

    #ok("Synced Poster ID Counts")
  };

  public shared ({ caller }) func deleteAllPosts() : async Result.Result<Text, Types.Error> {
    assert Utils.isAdmin(caller);
    let postKeys = postStore.keys();
    for (postKey in postKeys) {
      postStore.delete(postKey)
    };
    let boardKeys = boardStore.keys();
    for (boardKey in boardKeys) {
      let entry : ?Types.Board = boardStore.get(boardKey);
      let exists = Option.isSome(?entry);
      switch (entry) {
        case (?exists) {
          var updatedBoard = {
            abbreviation = exists.abbreviation : Text;
            name = exists.name : Text;
            timeStamp = exists.timeStamp : Int;
            latestActivityTimeStamp = Time.now() : Int;
            ownerPrincipal = exists.ownerPrincipal : Principal;
            nextPostId = 0 : Nat32;
            threadCount = 0 : Nat32;
            postCount = 0 : Nat32;
            showFlags = exists.showFlags : Bool;
            textOnly = exists.textOnly : Bool;
            forceAnonymity = exists.forceAnonymity : Bool;
            gated = exists.gated : Bool;
            gateType = exists.gateType : Text;
            gateToken = exists.gateToken : Text;
            gateTokenAmount = exists.gateTokenAmount : Nat32;
            listed = exists.listed : Bool;
            inDevelopment = exists.inDevelopment : Bool;
            allFileCount = 0 : Nat32;
            allFileSize = 0 : Int;
            posts = []
          } : Types.Board;
          boardStore.put(updatedBoard.abbreviation, updatedBoard)
        };
        case (null) { return #err(#NotFound) }
      }
    };
    #ok("Deleted all posts")
  };

  public query func getThread(boardAbbreviation : Text, threadId : Text) : async [Types.Post] {
    let threadEntry : ?Types.Post = postStore.get(boardAbbreviation # "/" # threadId);
    let threadExists = Option.isSome(?threadEntry);
    switch (threadEntry) {
      case (?threadExists) {
        let threadReplies = threadExists.replies;
        let postBuffer : Buffer.Buffer<Types.Post> = Buffer.Buffer(threadReplies.size() +1);
        postBuffer.add(threadExists);
        for (post in Iter.fromArray(threadReplies)) {
          let foundPost = postStore.get(boardAbbreviation # "/" #Nat32.toText(post));
          let foundPostExists = Option.isSome(foundPost);
          switch (foundPost) {
            case (?foundPostExists) {
              postBuffer.add(foundPostExists)
            };
            case (null) {}
          }
        };
        postBuffer.toArray()
      };
      case (null) { [] }
    }
  };

  public shared ({ caller }) func createReply(threadKey : Text, inPost : Types.PostCreate) : async Result.Result<Types.Post, Types.Error> {
    let user : ?Types.User = userStore.get(caller);
    let userExists = Option.isSome(?user);
    switch (user) {
      case (?userExists) {
        assert not userExists.blackListed
      };
      case (null) {}
    };

    let threadEntry : ?Types.Post = postStore.get(threadKey);
    let threadExists = Option.isSome(?threadEntry);
    switch (threadEntry) {
      case (?threadExists) {

        let latestActivityTimeStamp = if (inPost.saged) {
          threadExists.latestActivityTimeStamp
        } else { Time.now() };

        let nextPostId = await getNextPostId(inPost.boardAbbreviation);
        var newPost = {
          id = nextPostId;
          threadKey = threadKey;
          boardAbbreviation = inPost.boardAbbreviation;
          ownerPrincipal = caller;
          icpBalance = inPost.icpBalance;
          icpReceived = 0.00;
          acceptTips = inPost.acceptTips;
          posterId = inPost.posterId;
          threadPosterIds = [];
          siteAnonId = inPost.siteAnonId;
          threadAnonId = inPost.threadAnonId;
          subject = inPost.subject;
          body = inPost.body;
          stickied = inPost.stickied;
          locked = inPost.locked;
          flagged = false;
          hidden = false;
          saged = inPost.saged;
          op = false;
          posterIdColor = inPost.posterIdColor;
          timeStamp = Time.now() : Int;
          latestActivityTimeStamp = latestActivityTimeStamp : Int;
          reportCount = 0 : Nat32;
          reporterPrincipals = [] : [Principal];
          tags = [] : [Types.TagSummary];
          replies = [];
          replyCount = 0 : Nat32;
          mentions = inPost.mentions;
          mentionedBy = [];
          fileCount = 0 : Nat32;
          filePath = inPost.filePath;
          fileNsfw = inPost.fileNsfw;
          fileType = inPost.fileType;
          fileExtension = inPost.fileExtension;
          fileName = inPost.fileName;
          fileSize = inPost.fileSize
        } : Types.Post;
        let postKey = newPost.boardAbbreviation # "/" #Nat32.toText(newPost.id);
        postStore.put(postKey, newPost);
        var resultIncrementBoardNextPostId : Result.Result<Types.Board, Types.Error> = await incrementBoardNextPostId(newPost.boardAbbreviation, false, newPost.saged);
        var resultAddPostToThread : Result.Result<Types.Post, Types.Error> = await addPostToThread(threadKey, newPost);
        #ok(newPost)
      };
      case (null) { #err(#NotFound) }
    }
  };

  func addPostToThread(threadKey : Text, inPost : Types.Post) : async Result.Result<Types.Post, Types.Error> {

    let entry : ?Types.Post = postStore.get(threadKey);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        let latestActivityTimeStamp = if (inPost.saged) {
          exists.latestActivityTimeStamp
        } else { Time.now() };

        let replyBuffer : Buffer.Buffer<Nat32> = Buffer.fromArray(exists.replies);
        replyBuffer.add(inPost.id);

        var incrementFileCount = 0 : Nat32;
        if (inPost.filePath != "") {
          incrementFileCount := 1 : Nat32
        };

        let posterIdBuffer : Buffer.Buffer<Types.PosterId> = Buffer.fromArray(exists.threadPosterIds);
        let posterIdMatchBuffer : Buffer.Buffer<Types.PosterId> = Buffer.fromArray(Array.filter(exists.threadPosterIds, func(v : Types.PosterId) : Bool { v == inPost.posterId }));
        if (posterIdMatchBuffer.size() == 0) {
          posterIdBuffer.add(inPost.posterId)
        };

        var updatedPost = {
          id = exists.id;
          threadKey = exists.threadKey;
          boardAbbreviation = exists.boardAbbreviation;
          ownerPrincipal = exists.ownerPrincipal;
          icpBalance = exists.icpBalance;
          icpReceived = exists.icpReceived;
          acceptTips = exists.acceptTips;
          posterId = exists.posterId;
          threadPosterIds = posterIdBuffer.toArray();
          siteAnonId = exists.siteAnonId;
          threadAnonId = exists.threadAnonId;
          subject = exists.subject;
          body = exists.body;
          stickied = exists.stickied;
          locked = exists.locked;
          flagged = exists.flagged;
          hidden = exists.hidden;
          saged = exists.saged;
          op = exists.op;
          posterIdColor = exists.posterIdColor;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = latestActivityTimeStamp : Int;
          reportCount = exists.reportCount : Nat32;
          reporterPrincipals = exists.reporterPrincipals;
          tags = exists.tags : [Types.TagSummary];
          replies = replyBuffer.toArray() : [Nat32];
          replyCount = exists.replyCount + 1 : Nat32;
          mentions = exists.mentions;
          mentionedBy = exists.mentionedBy;
          fileCount = exists.fileCount + incrementFileCount : Nat32;
          filePath = exists.filePath;
          fileNsfw = exists.fileNsfw;
          fileType = exists.fileType;
          fileExtension = exists.fileExtension;
          fileName = exists.fileName;
          fileSize = exists.fileSize
        } : Types.Post;
        postStore.put(threadKey, updatedPost);
        #ok(updatedPost)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func removeThreadFromBoard(boardAbbreviation : Text, threadId : Nat32) : async Result.Result<Types.Board, Types.Error> {
    let entry : ?Types.Board = boardStore.get(boardAbbreviation);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var threadCount = exists.threadCount;
        var postCount = exists.postCount;
        threadCount := Nat32.sub(threadCount, 1);
        postCount := Nat32.sub(postCount, 1);
        var updatedBoard = {
          abbreviation = exists.abbreviation : Text;
          name = exists.name : Text;
          timeStamp = exists.timeStamp : Int;
          latestActivityTimeStamp = exists.latestActivityTimeStamp : Int;
          ownerPrincipal = exists.ownerPrincipal : Principal;
          nextPostId = exists.nextPostId : Nat32;
          threadCount = threadCount : Nat32;
          postCount = postCount : Nat32;
          showFlags = exists.showFlags : Bool;
          textOnly = exists.textOnly : Bool;
          forceAnonymity = exists.forceAnonymity : Bool;
          gated = exists.gated : Bool;
          gateType = exists.gateType : Text;
          gateToken = exists.gateToken : Text;
          gateTokenAmount = exists.gateTokenAmount : Nat32;
          listed = exists.listed : Bool;
          inDevelopment = exists.inDevelopment : Bool;
          allFileCount = exists.allFileCount : Nat32;
          allFileSize = exists.allFileSize : Int;
          posts = Array.filter(exists.posts, func(k : Nat32) : Bool { k != threadId }) : [Nat32]
        } : Types.Board;
        boardStore.put(exists.abbreviation, updatedBoard);
        #ok(updatedBoard)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func removeReplyFromThread(threadKey : Text, postId : Nat32) : async Result.Result<Types.Post, Types.Error> {
    let entry : ?Types.Post = postStore.get(threadKey);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var replyCount = Nat32.sub(exists.replyCount, 1);
        var updatedPost = {
          id = exists.id;
          threadKey = exists.threadKey;
          boardAbbreviation = exists.boardAbbreviation;
          ownerPrincipal = exists.ownerPrincipal;
          icpBalance = exists.icpBalance;
          icpReceived = exists.icpReceived;
          acceptTips = exists.acceptTips;
          posterId = exists.posterId;
          threadPosterIds = exists.threadPosterIds;
          siteAnonId = exists.siteAnonId;
          threadAnonId = exists.threadAnonId;
          subject = exists.subject;
          body = exists.body;
          stickied = exists.stickied;
          locked = exists.locked;
          flagged = exists.flagged;
          hidden = exists.hidden;
          saged = exists.saged;
          op = exists.op;
          posterIdColor = exists.posterIdColor;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          reportCount = exists.reportCount;
          reporterPrincipals = exists.reporterPrincipals;
          tags = exists.tags;
          replies = Array.filter(exists.replies, func(k : Nat32) : Bool { k != postId }) : [Nat32];
          replyCount = replyCount;
          mentions = exists.mentions;
          mentionedBy = exists.mentionedBy;
          fileCount = exists.fileCount;
          filePath = exists.filePath;
          fileNsfw = exists.fileNsfw;
          fileType = exists.fileType;
          fileExtension = exists.fileExtension;
          fileName = exists.fileName;
          fileSize = exists.fileSize
        } : Types.Post;

        postStore.put(threadKey, updatedPost);
        #ok(updatedPost)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func toggleNSFW(postKey : Text) : async Result.Result<Types.Post, Types.Error> {
    let entry : ?Types.Post = postStore.get(postKey);
    var exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var isFileNsfw = not exists.fileNsfw;
        var updatedPost = {
          id = exists.id;
          threadKey = exists.threadKey;
          boardAbbreviation = exists.boardAbbreviation;
          ownerPrincipal = exists.ownerPrincipal;
          icpBalance = exists.icpBalance;
          acceptTips = exists.acceptTips;
          icpReceived = exists.icpReceived;
          posterId = exists.posterId;
          threadPosterIds = exists.threadPosterIds;
          siteAnonId = exists.siteAnonId;
          threadAnonId = exists.threadAnonId;
          subject = exists.subject;
          body = exists.body;
          stickied = exists.stickied;
          locked = exists.locked;
          flagged = exists.flagged;
          hidden = exists.hidden;
          saged = exists.saged;
          op = exists.op;
          posterIdColor = exists.posterIdColor;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp : Int;
          tags = exists.tags;
          reportCount = exists.reportCount : Nat32;
          reporterPrincipals = exists.reporterPrincipals;
          replies = exists.replies : [Nat32];
          replyCount = exists.replyCount : Nat32;
          mentions = exists.mentions;
          mentionedBy = exists.mentionedBy;
          fileCount = exists.fileCount : Nat32;
          filePath = exists.filePath;
          fileNsfw = isFileNsfw;
          fileType = exists.fileType;
          fileExtension = exists.fileExtension;
          fileName = exists.fileName;
          fileSize = exists.fileSize
        } : Types.Post;
        postStore.put(updatedPost.threadKey, updatedPost);
        #ok(updatedPost)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func hidePost(postKey : Text) : async Result.Result<Types.Post, Types.Error> {
    assert Utils.isAdmin(caller);
    let entry : ?Types.Post = postStore.get(postKey);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedPost = {
          id = exists.id;
          threadKey = exists.threadKey;
          boardAbbreviation = exists.boardAbbreviation;
          ownerPrincipal = exists.ownerPrincipal;
          icpBalance = exists.icpBalance;
          acceptTips = exists.acceptTips;
          icpReceived = exists.icpReceived;
          posterId = exists.posterId;
          threadPosterIds = exists.threadPosterIds;
          siteAnonId = exists.siteAnonId;
          threadAnonId = exists.threadAnonId;
          subject = exists.subject;
          body = exists.body;
          stickied = exists.stickied;
          locked = exists.locked;
          flagged = exists.flagged;
          hidden = true;
          saged = exists.saged;
          op = exists.op;
          posterIdColor = exists.posterIdColor;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp : Int;
          tags = exists.tags;
          reportCount = exists.reportCount : Nat32;
          reporterPrincipals = exists.reporterPrincipals;
          replies = exists.replies : [Nat32];
          replyCount = exists.replyCount : Nat32;
          mentions = exists.mentions;
          mentionedBy = exists.mentionedBy;
          fileCount = exists.fileCount : Nat32;
          filePath = exists.filePath;
          fileNsfw = exists.fileNsfw;
          fileType = exists.fileType;
          fileExtension = exists.fileExtension;
          fileName = exists.fileName;
          fileSize = exists.fileSize
        } : Types.Post;
        postStore.put(postKey, updatedPost);
        #ok(updatedPost)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func reportPost(postKey : Text, reportType : Types.ReportType, anonReportLimit : Nat, authenticatedReportLimit : Nat) : async Result.Result<Types.Post, Types.Error> {
    var userRole = #Anon : Types.RoleOptions;
    if (not Utils.isAnon(caller)) {
      let user : ?Types.User = userStore.get(caller);
      let userExists = Option.isSome(?user);
      switch (user) {
        case (?userExists) {
          userRole := userExists.role
        };
        case (null) {}
      }
    };

    let post : ?Types.Post = postStore.get(postKey);
    let postExists = Option.isSome(?post);

    switch (post) {
      case (?postExists) {
        let reporterPrincipalsBuffer : Buffer.Buffer<Principal> = Buffer.fromArray(postExists.reporterPrincipals);

        if (userRole == (#SeaChad : Types.RoleOptions)) {

          let reporterPrincipalsMatchBuffer : Buffer.Buffer<Principal> = Buffer.fromArray(Array.filter(postExists.reporterPrincipals, func(v : Principal) : Bool { v == caller }));
          if (reporterPrincipalsMatchBuffer.size() == 0) {
            reporterPrincipalsBuffer.add(caller)
          } else {
            return #err(#AlreadyReported)
          }
        };

        var reportLimit = 0;
        if (Utils.isAnon(postExists.ownerPrincipal)) {
          reportLimit := anonReportLimit
        } else {
          reportLimit := authenticatedReportLimit
        };

        var flagged = postExists.flagged;
        if (reporterPrincipalsBuffer.size() >= reportLimit) {
          flagged := true
        };

        var updatedPost = {
          id = postExists.id;
          threadKey = postExists.threadKey;
          boardAbbreviation = postExists.boardAbbreviation;
          ownerPrincipal = postExists.ownerPrincipal;
          icpBalance = postExists.icpBalance;
          icpReceived = postExists.icpReceived;
          acceptTips = postExists.acceptTips;
          posterId = postExists.posterId;
          threadPosterIds = postExists.threadPosterIds;
          siteAnonId = postExists.siteAnonId;
          threadAnonId = postExists.threadAnonId;
          subject = postExists.subject;
          body = postExists.body;
          stickied = postExists.stickied;
          locked = postExists.locked;
          flagged = flagged;
          hidden = postExists.hidden;
          saged = postExists.saged;
          op = postExists.op;
          posterIdColor = postExists.posterIdColor;
          timeStamp = postExists.timeStamp;
          latestActivityTimeStamp = postExists.latestActivityTimeStamp : Int;
          reportCount = postExists.reportCount + 1 : Nat32;
          reporterPrincipals = reporterPrincipalsBuffer.toArray() : [Principal];
          tags = postExists.tags;
          replies = postExists.replies : [Nat32];
          replyCount = postExists.replyCount : Nat32;
          mentions = postExists.mentions;
          mentionedBy = postExists.mentionedBy;
          fileCount = postExists.fileCount : Nat32;
          filePath = postExists.filePath;
          fileNsfw = postExists.fileNsfw;
          fileType = postExists.fileType;
          fileExtension = postExists.fileExtension;
          fileName = postExists.fileName;
          fileSize = postExists.fileSize
        } : Types.Post;
        postStore.put(postKey, updatedPost);
        #ok(updatedPost)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func tagPost(postKey : Text, tagType : Types.TagType, userRole : Types.RoleOptions) : async Result.Result<Types.Post, Types.Error> {
    let post : ?Types.Post = postStore.get(postKey);
    let postExists = Option.isSome(?post);
    switch (post) {
      case (?postExists) {
        var reportCount = 0 : Nat32;
        var tagExists = false;
        let tagBuffer : Buffer.Buffer<Types.TagSummary> = Buffer.Buffer(postExists.tags.size());
        for (existingReport in Iter.fromArray(postExists.tags)) {
          let roleVoteBuffer : Buffer.Buffer<Types.TagVote> = Buffer.Buffer(existingReport.vote.size());
          if (tagType == existingReport.tag) {
            tagExists := true;
            var roleExists = false;
            for (existingRole in Iter.fromArray(existingReport.vote)) {
              if (userRole == existingRole.role) {
                roleExists := true;
                var updatedVote = {
                  role = userRole : Types.RoleOptions;
                  count = existingRole.count +1 : Nat32
                };
                roleVoteBuffer.add(updatedVote)
              } else {
                roleVoteBuffer.add(existingRole)
              };

            };
            if (roleExists == false) {
              var newRole = {
                role = userRole : Types.RoleOptions;
                count = 1 : Nat32
              };
              roleVoteBuffer.add(newRole)
            };
            var newTag = {
              tag = tagType : Types.TagType;
              vote = roleVoteBuffer.toArray() : [Types.TagVote]
            };
            tagBuffer.add(newTag)
          } else {
            tagBuffer.add(existingReport)
          }
        };
        if (tagExists == false) {
          var newTag = {
            tag = tagType : Types.TagType;
            vote = [{
              role = userRole : Types.RoleOptions;
              count = 1 : Nat32
            }] : [Types.TagVote]
          } : Types.TagSummary;
          tagBuffer.add(newTag)
        };
        var updatedPost = {
          id = postExists.id;
          threadKey = postExists.threadKey;
          boardAbbreviation = postExists.boardAbbreviation;
          ownerPrincipal = postExists.ownerPrincipal;
          icpBalance = postExists.icpBalance;
          icpReceived = postExists.icpReceived;
          acceptTips = postExists.acceptTips;
          posterId = postExists.posterId;
          threadPosterIds = postExists.threadPosterIds;
          siteAnonId = postExists.siteAnonId;
          threadAnonId = postExists.threadAnonId;
          subject = postExists.subject;
          body = postExists.body;
          stickied = postExists.stickied;
          locked = postExists.locked;
          flagged = postExists.flagged;
          hidden = postExists.hidden;
          saged = postExists.saged;
          op = postExists.op;
          posterIdColor = postExists.posterIdColor;
          timeStamp = postExists.timeStamp;
          latestActivityTimeStamp = postExists.latestActivityTimeStamp : Int;
          reportCount = postExists.reportCount + reportCount : Nat32;
          reporterPrincipals = postExists.reporterPrincipals;
          tags = tagBuffer.toArray() : [Types.TagSummary];
          replies = postExists.replies : [Nat32];
          replyCount = postExists.replyCount : Nat32;
          mentions = postExists.mentions;
          mentionedBy = postExists.mentionedBy;
          fileCount = postExists.fileCount : Nat32;
          filePath = postExists.filePath;
          fileNsfw = postExists.fileNsfw;
          fileType = postExists.fileType;
          fileExtension = postExists.fileExtension;
          fileName = postExists.fileName;
          fileSize = postExists.fileSize
        } : Types.Post;
        postStore.put(postKey, updatedPost);
        #ok(updatedPost)

      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func recordIcpTip(postKey : Text, donationAmountIcp : Float) : async Result.Result<Types.Post, Types.Error> {
    let entry : ?Types.Post = postStore.get(postKey);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedPost = {
          id = exists.id;
          threadKey = exists.threadKey;
          boardAbbreviation = exists.boardAbbreviation;
          ownerPrincipal = exists.ownerPrincipal;
          icpBalance = exists.icpBalance;
          acceptTips = exists.acceptTips;
          icpReceived = exists.icpReceived + donationAmountIcp;
          posterId = exists.posterId;
          threadPosterIds = exists.threadPosterIds;
          siteAnonId = exists.siteAnonId;
          threadAnonId = exists.threadAnonId;
          subject = exists.subject;
          body = exists.body;
          stickied = exists.stickied;
          locked = exists.locked;
          flagged = exists.flagged;
          hidden = exists.hidden;
          saged = exists.saged;
          op = exists.op;
          posterIdColor = exists.posterIdColor;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp : Int;
          tags = exists.tags;
          reportCount = exists.reportCount : Nat32;
          reporterPrincipals = exists.reporterPrincipals;
          replies = exists.replies : [Nat32];
          replyCount = exists.replyCount : Nat32;
          mentions = exists.mentions;
          mentionedBy = exists.mentionedBy;
          fileCount = exists.fileCount : Nat32;
          filePath = exists.filePath;
          fileNsfw = exists.fileNsfw;
          fileType = exists.fileType;
          fileExtension = exists.fileExtension;
          fileName = exists.fileName;
          fileSize = exists.fileSize
        } : Types.Post;
        postStore.put(postKey, updatedPost);
        #ok(updatedPost)
      };
      case (null) { #err(#NotFound) }
    }
  };

  func updateMentionedBy(abbreviation : Text, threadId : Nat32, mentions : [Text]) : async [Text] {
    for (mention in Iter.fromArray(mentions)) {
      let key = abbreviation # "/" #Nat32.toText(threadId);
      let entry : ?Types.Post = postStore.get(key);
      let exists = Option.isSome(?entry);
      switch (entry) {
        case (?exists) {

          let mentionedByBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.mentionedBy);
          mentionedByBuffer.add(key);

          var updatedPost = {
            id = exists.id;
            threadKey = exists.threadKey;
            boardAbbreviation = exists.boardAbbreviation;
            ownerPrincipal = exists.ownerPrincipal;
            icpBalance = exists.icpBalance;
            icpReceived = exists.icpReceived;
            acceptTips = exists.acceptTips;
            posterId = exists.posterId;
            threadPosterIds = exists.threadPosterIds;
            siteAnonId = exists.siteAnonId;
            threadAnonId = exists.threadAnonId;
            subject = exists.subject;
            body = exists.body;
            stickied = exists.stickied;
            locked = exists.locked;
            flagged = exists.flagged;
            hidden = exists.hidden;
            saged = exists.saged;
            op = exists.op;
            posterIdColor = exists.posterIdColor;
            timeStamp = exists.timeStamp;
            latestActivityTimeStamp = exists.latestActivityTimeStamp : Int;
            reportCount = exists.reportCount : Nat32;
            reporterPrincipals = exists.reporterPrincipals;
            tags = exists.tags;
            replies = exists.replies : [Nat32];
            replyCount = exists.replyCount : Nat32;
            mentions = exists.mentions;
            mentionedBy = mentionedByBuffer.toArray() : [Text];
            fileCount = exists.fileCount : Nat32;
            filePath = exists.filePath;
            fileNsfw = exists.fileNsfw;
            fileType = exists.fileType;
            fileExtension = exists.fileExtension;
            fileName = exists.fileName;
            fileSize = exists.fileSize
          } : Types.Post;
          postStore.put(key, updatedPost)
        };
        case (null) {}
      }
    };
    return mentions
  };

  // User
  private var userStore : HashMap.HashMap<Principal, Types.User> = HashMap.HashMap<Principal, Types.User>(10, Principal.equal, Principal.hash);
  private stable var userEntries : [(Principal, Types.User)] = [];

  public query func getUserCount() : async Nat { userStore.size() };

  public shared ({ caller }) func getOrCreateUser(inUser : Types.UserCreate) : async Result.Result<Types.User, Types.Error> {
    assert not Utils.isAnon(caller);
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        #ok(exists)
      };
      case (null) {
        var role : Types.RoleOptions = #User;
        if (Utils.isAdmin(caller)) { role := #Admin };
        var newUser = {
          principal = caller;
          userNames = [];
          role = role;
          timeStamp = Time.now();
          latestActivityTimeStamp = Time.now();
          principalSource = inUser.principalSource;
          icpBalance = 0;
          nftCollection = [];
          minimizedPosts = [];
          hiddenPosts = [];
          navbarBoards = ["biz", "p", "meta", "pol", "g"];
          watchedThreads = [];
          persistentAuthentication = true;
          showNsfw = false;
          showFlagged = false;
          blackListed = false

        } : Types.User;
        userStore.put(caller, newUser);
        #ok(newUser)
      }
    }
  };

  public query ({ caller }) func listUsers() : async Result.Result<[Types.User], Types.Error> {
    assert Utils.isAdmin(caller);
    let entries : Iter.Iter<(Principal, Types.User)> = userStore.entries();
    let iter : Iter.Iter<Types.User> = Iter.map(entries, func((key : Principal, value : Types.User)) : Types.User { value });
    #ok(Iter.toArray(iter))
  };

  public shared ({ caller }) func deleteAllUsers() : async Result.Result<Text, Types.Error> {
    assert Utils.isAdmin(caller);
    let keys = userStore.keys();
    for (key in keys) { userStore.delete(key) };
    #ok("Deleted all users")
  };

  public shared ({ caller }) func claimUserName(userNameIn : Text) : async Result.Result<Types.User, Types.Error> {
    let users = userStore.vals();
    for (user in users) {
      for (userName in Iter.fromArray(user.userNames)) {
        if (userName == userNameIn) { return #err(#AlreadyExists) }
      }
    };
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        let userNameBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.userNames);
        userNameBuffer.add(userNameIn);

        var updatedUser = {
          principal = exists.principal;
          userNames = userNameBuffer.toArray() : [Text];
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func removeUserName(userNameIn : Text) : async Result.Result<Types.User, Types.Error> {

    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        var updatedUserNames = Array.filter(exists.userNames, func(v : Text) : Bool { v != userNameIn });

        var updatedUser = {
          principal = exists.principal;
          userNames = updatedUserNames : [Text];
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func addNavbarBoard(boardKey : Text) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        let navbarBoardBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.navbarBoards);
        navbarBoardBuffer.add(boardKey);

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = navbarBoardBuffer.toArray();
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func removeNavBarBoard(navBarBoardIn : Text) : async Result.Result<Types.User, Types.Error> {

    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        var updatedNavBarBoards = Array.filter(exists.navbarBoards, func(v : Text) : Bool { v != navBarBoardIn });

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = updatedNavBarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func clearNavbarBoards() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = [];
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func clearMinimizedPosts() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = [];
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func clearHiddenPosts() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = [];
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func clearWatchedThreads() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = [];
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func removeWatchedThread(watchedThreadIn : Text) : async Result.Result<Types.User, Types.Error> {

    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        var updatedWatchedThreads = Array.filter(exists.watchedThreads, func(v : Text) : Bool { v != watchedThreadIn });

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = updatedWatchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func togglePersistentAuthentication() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = not exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }

  };

  public shared ({ caller }) func toggleMinimizedPost(postKey : Text) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var minimizedPosts = [] : [Text];

        let minimizedPostMatchBuffer : Buffer.Buffer<Text> = Buffer.fromArray(Array.filter(exists.minimizedPosts, func(v : Text) : Bool { v == postKey }));
        if (minimizedPostMatchBuffer.size() > 0) {
          minimizedPosts := Array.filter(exists.minimizedPosts, func(v : Text) : Bool { v != postKey });

        } else {
          let minimizedPostBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.minimizedPosts);
          minimizedPostBuffer.add(postKey);
          minimizedPosts := minimizedPostBuffer.toArray() : [Text]
        };

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func toggleHiddenPost(postKey : Text) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var hiddenPosts = [] : [Text];

        let hiddenPostMatchBuffer : Buffer.Buffer<Text> = Buffer.fromArray(Array.filter(exists.hiddenPosts, func(v : Text) : Bool { v == postKey }));
        if (hiddenPostMatchBuffer.size() > 0) {
          hiddenPosts := Array.filter(exists.hiddenPosts, func(v : Text) : Bool { v != postKey });

        } else {
          let hiddenPostBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.hiddenPosts);
          hiddenPostBuffer.add(postKey);
          hiddenPosts := hiddenPostBuffer.toArray() : [Text]
        };

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func syncUserNfts(nftCollection : [Types.NftCollection]) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func syncTokenBalance(icpBalance : Float) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func forgetIcpBalance() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = 0;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func forgetNfts() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = [];
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func clearUserNames() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = [];
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func toggleMinimizePost(postKey : Text) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        var minimizedPosts = [] : [Text];

        let minimizedPostMatchBuffer : Buffer.Buffer<Text> = Buffer.fromArray(Array.filter(exists.minimizedPosts, func(v : Text) : Bool { v == postKey }));
        if (minimizedPostMatchBuffer.size() > 0) {
          minimizedPosts := Array.filter(exists.minimizedPosts, func(v : Text) : Bool { v != postKey });

        } else {
          let minimizedPostBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.minimizedPosts);
          minimizedPostBuffer.add(postKey);
          minimizedPosts := minimizedPostBuffer.toArray() : [Text]
        };

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = minimizedPosts : [Text];
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func toggleHidePost(postKey : Text) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {

        var hiddenPosts = [] : [Text];

        let hiddenPostMatchBuffer : Buffer.Buffer<Text> = Buffer.fromArray(Array.filter(exists.hiddenPosts, func(v : Text) : Bool { v == postKey }));
        if (hiddenPostMatchBuffer.size() > 0) {
          hiddenPosts := Array.filter(exists.hiddenPosts, func(v : Text) : Bool { v != postKey });

        } else {
          let hiddenPostBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.hiddenPosts);
          hiddenPostBuffer.add(postKey);
          hiddenPosts := hiddenPostBuffer.toArray() : [Text]
        };

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = hiddenPosts : [Text];
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func userToggleWatchThread(postKey : Text) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var watchedThreads = [] : [Text];

        let watchedThreadMatchBuffer : Buffer.Buffer<Text> = Buffer.fromArray(Array.filter(exists.watchedThreads, func(v : Text) : Bool { v == postKey }));
        if (watchedThreadMatchBuffer.size() > 0) {
          watchedThreads := Array.filter(exists.watchedThreads, func(v : Text) : Bool { v != postKey });

        } else {
          let watchThreadBuffer : Buffer.Buffer<Text> = Buffer.fromArray(exists.watchedThreads);
          watchThreadBuffer.add(postKey);
          watchedThreads := watchThreadBuffer.toArray() : [Text]
        };

        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = watchedThreads : [Text];
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func getUser(userPrinciopal : Principal) : async Result.Result<Types.User, Types.Error> {
    assert Utils.isAdmin(caller);
    assert not Principal.isAnonymous(userPrinciopal);
    let user : ?Types.User = userStore.get(userPrinciopal);
    let userExists = Option.isSome(?user);
    switch (user) {
      case (?userExists) {
        #ok(userExists)
      };
      case (null) { #err(#NotFound) }
    };

  };

  public shared ({ caller }) func toggleBlacklistPrincipal(postOwnerPrincipal : Principal) : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(postOwnerPrincipal);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = true
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);

        // let key = post.boardAbbreviation # "/" #Nat32.toText(post.id);
        // postStore.delete(key);

        #ok(updatedUser)

      };
      case (null) { #err(#NotFound) }
    };

  };

  public shared ({ caller }) func toggleShowNsfw() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = not exists.showNsfw;
          showFlagged = exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }

  };

  public shared ({ caller }) func toggleShowFlagged() : async Result.Result<Types.User, Types.Error> {
    let entry : ?Types.User = userStore.get(caller);
    let exists = Option.isSome(?entry);
    switch (entry) {
      case (?exists) {
        var updatedUser = {
          principal = exists.principal;
          userNames = exists.userNames;
          role = exists.role;
          timeStamp = exists.timeStamp;
          latestActivityTimeStamp = exists.latestActivityTimeStamp;
          principalSource = exists.principalSource;
          icpBalance = exists.icpBalance;
          nftCollection = exists.nftCollection;
          minimizedPosts = exists.minimizedPosts;
          hiddenPosts = exists.hiddenPosts;
          navbarBoards = exists.navbarBoards;
          watchedThreads = exists.watchedThreads;
          persistentAuthentication = exists.persistentAuthentication;
          showNsfw = exists.showNsfw;
          showFlagged = not exists.showFlagged;
          blackListed = exists.blackListed
        } : Types.User;
        userStore.put(updatedUser.principal, updatedUser);
        #ok(updatedUser)
      };
      case (null) { #err(#NotFound) }
    }
  };

  public shared ({ caller }) func assignSeaChadRoles() : async Result.Result<Text, Types.Error> {
    assert Utils.isAdmin(caller);

    let allUsers : Iter.Iter<(Principal, Types.User)> = userStore.entries();
    let allUsersIter : Iter.Iter<Types.User> = Iter.map(allUsers, func((key : Principal, value : Types.User)) : Types.User { value });
    let ogUsers = Array.filter(Iter.toArray(allUsersIter), func(v : Types.User) : Bool { v.timeStamp < 1669359280784360000 });

    for (user in Iter.fromArray(ogUsers)) {

      var updatedUser = {
        principal = user.principal;
        userNames = user.userNames;
        role = #SeaChad;
        timeStamp = user.timeStamp;
        latestActivityTimeStamp = user.latestActivityTimeStamp;
        principalSource = user.principalSource;
        icpBalance = user.icpBalance;
        nftCollection = user.nftCollection;
        minimizedPosts = user.minimizedPosts;
        hiddenPosts = user.hiddenPosts;
        navbarBoards = user.navbarBoards;
        watchedThreads = user.watchedThreads;
        persistentAuthentication = user.persistentAuthentication;
        showNsfw = user.showNsfw;
        showFlagged = user.showFlagged;
        blackListed = user.blackListed
      } : Types.User;

      userStore.put(user.principal, updatedUser)
    };

    #ok("Synced File Counts")
  };

  public shared ({ caller }) func disallowIc0Tipping() : async Result.Result<Text, Types.Error> {
    assert Utils.isAdmin(caller);

    let entries : Iter.Iter<(Text, Types.Post)> = postStore.entries();
    let iter : Iter.Iter<Types.Post> = Iter.map(entries, func((key : Text, value : Types.Post)) : Types.Post { value });

    for (post in iter) {

      var postOwner = post.ownerPrincipal;
      var acceptTips = post.acceptTips;

      let user : ?Types.User = userStore.get(postOwner);
      let userExists = Option.isSome(?user);
      switch (user) {
        case (?userExists) {
          if (userExists.principalSource == "ic0") {
            acceptTips := false
          }
        };
        case (null) {}
      };

      var updatedPost = {
        id = post.id;
        threadKey = post.threadKey;
        boardAbbreviation = post.boardAbbreviation;
        ownerPrincipal = post.ownerPrincipal;
        icpBalance = post.icpBalance;
        icpReceived = post.icpReceived;
        acceptTips = acceptTips;
        posterId = post.posterId;
        threadPosterIds = post.threadPosterIds;
        siteAnonId = post.siteAnonId;
        threadAnonId = post.threadAnonId;
        subject = post.subject;
        body = post.body;
        stickied = post.stickied;
        locked = post.locked;
        flagged = post.flagged;
        hidden = post.hidden;
        saged = post.saged;
        op = post.op;
        posterIdColor = post.posterIdColor;
        timeStamp = post.timeStamp;
        latestActivityTimeStamp = post.latestActivityTimeStamp;
        reportCount = post.reportCount;
        reporterPrincipals = post.reporterPrincipals;
        tags = post.tags;
        replies = post.replies;
        replyCount = post.replyCount;
        mentions = post.mentions;
        mentionedBy = post.mentionedBy;
        fileCount = post.fileCount;
        filePath = post.filePath;
        fileNsfw = post.fileNsfw;
        fileType = post.fileType;
        fileExtension = post.fileExtension;
        fileName = post.fileName;
        fileSize = post.fileSize
      } : Types.Post;
      postStore.put(post.boardAbbreviation # "/" # Nat32.toText(post.id), updatedPost);

    };

    #ok("Disallowed ic0 tipping")
  };

  public query ({ caller }) func getPrincipal() : async Principal {
    caller
  };

  public query ({ caller }) func isAnon() : async Bool {
    Principal.isAnonymous(caller)
  };

  public shared ({ caller }) func importBoards(inBoards : [Types.Board]) : async Result.Result<[Types.Board], Types.Error> {
    assert Utils.isAdmin(caller);
    for (board in Iter.fromArray(inBoards)) {
      boardStore.put(board.abbreviation, board)
    };
    let entries : Iter.Iter<(Text, Types.Board)> = boardStore.entries();
    let iter : Iter.Iter<Types.Board> = Iter.map(entries, func((key : Text, value : Types.Board)) : Types.Board { value });
    #ok(Iter.toArray(iter))
  };

  public shared ({ caller }) func importPosts(inPosts : [Types.Post]) : async Result.Result<[Types.Post], Types.Error> {
    assert Utils.isAdmin(caller);
    for (post in Iter.fromArray(inPosts)) {
      postStore.put(post.boardAbbreviation # "/" #Nat32.toText(post.id), post)
    };
    let entries : Iter.Iter<(Text, Types.Post)> = postStore.entries();
    let iter : Iter.Iter<Types.Post> = Iter.map(entries, func((key : Text, value : Types.Post)) : Types.Post { value });
    #ok(Iter.toArray(iter))
  };

  public shared ({ caller }) func importUsers(inUsers : [Types.User]) : async Result.Result<[Types.User], Types.Error> {
    assert Utils.isAdmin(caller);
    for (user in Iter.fromArray(inUsers)) {
      userStore.put(user.principal, user)
    };
    let entries : Iter.Iter<(Principal, Types.User)> = userStore.entries();
    let iter : Iter.Iter<Types.User> = Iter.map(entries, func((key : Principal, value : Types.User)) : Types.User { value });
    #ok(Iter.toArray(iter))
  };

  // canister info

  public type Definite_Canister_Settings = {
    freezing_threshold : Nat;
    controllers : [Principal];
    memory_allocation : Nat;
    compute_allocation : Nat
  };

  public type Canister_Status = {
    status : { #stopped; #stopping; #running };
    memory_size : Nat;
    cycles : Nat;
    settings : Definite_Canister_Settings;
    module_hash : ?[Nat8]
  };

  public shared ({ caller }) func getCaller() : async Text {
    return Principal.toText(caller)
  };

  public query func getBackendCycleBalance() : async Nat { Cycles.balance() };

  public func getFrontendCycleBalance() : async Nat {
    let statusCanister = actor ("e3mmv-5qaaa-aaaah-aadma-cai") : actor {
      canister_status : ({ canister_id : Principal }) -> async Canister_Status
    };
    let canister_id = await getFrontendCanisterId() : async Principal;
    let canisterStatus = await statusCanister.canister_status({
      canister_id : Principal
    });
    return canisterStatus.cycles
  };

  public func acceptCycles() : async () {
    let available = Cycles.available();
    let accepted = Cycles.accept(available);
    assert (accepted == available)
  };

  public func getBackendCanisterId() : async Principal {
    return Principal.fromActor(Seachan)
  };

  public func getFrontendCanisterId() : async Principal {

    // prod
    if (Principal.fromActor(Seachan) == Principal.fromText("y26ux-qiaaa-aaaag-aap3q-cai")) {
      return Principal.fromText("sfjch-siaaa-aaaak-qarnq-cai")
    }
    // staging
    else {
      return Principal.fromText("g2r2f-uiaaa-aaaak-qaszq-cai")
    }
  };

  public func test() : async Principal {

    // prod
    if (Principal.fromActor(Seachan) == Principal.fromText("y26ux-qiaaa-aaaag-aap3q-cai")) {
      return Principal.fromText("sfjch-siaaa-aaaak-qarnq-cai")
    }
    // staging
    else {
      return Principal.fromText("g2r2f-uiaaa-aaaak-qaszq-cai")
    }
  };

}
