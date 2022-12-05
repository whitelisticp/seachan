import Array "mo:base/Array";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

import Types "./Types";

module {

  let adminIds : [Text] = ["mgsh5-3u7ke-vzqde-dcdto-6ryfm-5qrog-g3qfe-ytjxi-jtefu-3j3aw-eae"];
  let modIds : [Text] = [];

  public func isAdmin(userPrincipal : Principal) : Bool {
    func identity(x : Text) : Bool { x == Principal.toText(userPrincipal) };
    Option.isSome(Array.find<Text>(adminIds, identity))
  };

  public func isMod(userPrincipal : Principal) : Bool {
    func identity(x : Text) : Bool { x == Principal.toText(userPrincipal) };
    Option.isSome(Array.find<Text>(modIds, identity))
  };

  public func isOwner(caller : Principal, ownerPrincipal : Principal) : Bool {
    Principal.equal(caller, ownerPrincipal)
  };

  public func isAnon(caller : Principal) : Bool {
    Principal.isAnonymous(caller)
  };

  // public func getFrontEndCanister() : Bool {
  //   Principal.isAnonymous(caller)
  // };

  

}
