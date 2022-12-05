import Buffer "mo:base/Buffer";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Trie "mo:base/Trie";

module Types {

  public type BoardCreate = {
    abbreviation : Text;
    name : Text;
    showFlags : Bool;
    textOnly : Bool;
    gated : Bool;
    gateType : Text;
    gateToken : Text;
    gateTokenAmount : Nat32;
    listed : Bool;
    forceAnonymity : Bool;
    inDevelopment : Bool
  };

  public type Board = {
    abbreviation : Text;
    name : Text;
    timeStamp : Int;
    latestActivityTimeStamp : Int;
    ownerPrincipal : Principal;
    nextPostId : Nat32;
    threadCount : Nat32;
    postCount : Nat32;
    showFlags : Bool;
    textOnly : Bool;
    gated : Bool;
    gateType : Text;
    gateToken : Text;
    gateTokenAmount : Nat32;
    listed : Bool;
    forceAnonymity : Bool;
    inDevelopment : Bool;
    allFileCount : Nat32;
    allFileSize : Int;
    posts : [Nat32]
  };

  public type Post = {
    id : Nat32;
    threadKey : Text;
    boardAbbreviation : Text;
    ownerPrincipal : Principal;
    icpBalance : Float;
    icpReceived : Float;
    acceptTips : Bool;
    posterId : PosterId;
    threadPosterIds : [PosterId];
    siteAnonId : Text;
    threadAnonId : Text;
    subject : Text;
    body : Text;
    op : Bool;
    stickied : Bool;
    locked : Bool;
    flagged : Bool;
    hidden : Bool;
    saged : Bool;
    posterIdColor : Text;
    timeStamp : Int;
    latestActivityTimeStamp : Int;
    reporterPrincipals : [Principal];
    reportCount : Nat32;
    tags : [TagSummary];
    replies : [Nat32];
    mentions : [Text];
    mentionedBy : [Text];
    replyCount : Nat32;
    fileCount : Nat32;
    fileNsfw : Bool;
    filePath : Text;
    fileType : Text;
    fileExtension : Text;
    fileName : Text;
    fileSize : Int
  };

  public type PostCreate = {
    boardAbbreviation : Text;
    subject : Text;
    body : Text;
    stickied : Bool;
    locked : Bool;
    saged : Bool;
    posterId : PosterId;
    siteAnonId : Text;
    threadAnonId : Text;
    icpBalance : Float;
    acceptTips : Bool;
    posterIdColor : Text;
    mentions : [Text];
    filePath : Text;
    fileNsfw : Bool;
    fileType : Text;
    fileExtension : Text;
    fileName : Text;
    fileSize : Int
  };

  public type User = {
    principal : Principal;
    userNames : [Text];
    role : RoleOptions;
    timeStamp : Int;
    latestActivityTimeStamp : Int;
    principalSource : Text;
    icpBalance : Float;
    nftCollection : [NftCollection];
    minimizedPosts : [Text];
    hiddenPosts : [Text];
    navbarBoards : [Text];
    watchedThreads : [Text];
    persistentAuthentication : Bool;
    showNsfw : Bool;
    showFlagged : Bool;
    blackListed : Bool;
  };

  public type UserCreate = {
    principalSource : Text
  };

  public type NftCollection = {
    name : Text;
    canisterId : Text;
    standard : Text;
    tokens : [NFTDetails];
    icon : Text;
    description : Text
  };

  public type NFTDetails = {
    index : Nat32;
    url : Text
  };

  public type PosterId = {
    #Anon : Text;
    #Principal : Text;
    #UserName : Text;
    #Admin : Text
  };

  public type RoleOptions = {
    #Owner;
    #Admin;
    #Mod;
    #User;
    #Anon;
    #SeaChad
  };

  public type Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
    #AlreadyReported
  };

  public type TagSummary = {
    tag : TagType;
    vote : [TagVote]
  };

  public type ReportType = {
    #LowQuality;
    #OffTopic;
    #Spam;
    #Scam;
    #Illegal
  };

  public type TagType = {
    #Based;
    #Cringe
  };

  public type TagVote = {
    role : RoleOptions;
    count : Nat32
  };

}
