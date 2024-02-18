module Types {
  public type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : HttpMethod;
    transform : ?TransformRawResponseFunction;
  };

  public type HttpHeader = {
    name : Text;
    value : Text;
  };

  public type HttpMethod = {
    #get;
    #post;
    #head;
  };

  public type HttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };

  public type TransformRawResponseFunction = {
    function : shared query TransformArgs -> async HttpResponsePayload;
    context : [Nat8];
  };

  //2.2 This type describes the arguments the transform function needs
  public type TransformArgs = {
    response : HttpResponsePayload;
    context : [Nat8];
  };

  public type DecodedHttpResponse = {
    status : Nat;
    body : Text; // body is Text now
    headers : [HttpHeader];
  };

  public type canister_id = Principal;

  public type canister_settings = {
    freezing_threshold : ?Nat;
    controllers : ?[Principal];
    memory_allocation : ?Nat;
    compute_allocation : ?Nat;
  };

  public type definite_canister_settings = {
    freezing_threshold : Nat;
    controllers : [Principal];
    memory_allocation : Nat;
    compute_allocation : Nat;
  };

  public type wasm_module = [Nat8];

  public type CustomTypes = {
    status : { #stopped; #stopping; #running };
    memory_size : Nat;
    cycles : Nat;
    settings : definite_canister_settings;
    idle_cycles_burned_per_day : Nat;
    module_hash : ?[Nat8];

  };

  public type Timestamp = Nat64;

  public type Actor = actor {
    canister_status : shared { canister_id : canister_id } -> async CustomTypes;
    http_request : HttpRequestArgs -> async HttpResponsePayload;

    create_canister : shared { settings : ?canister_settings } -> async {
      canister_id : canister_id;
    };

    delete_canister : shared { canister_id : canister_id } -> async ();

    deposit_cycles : shared { canister_id : canister_id } -> async ();

    install_code : shared {
      arg : [Nat8];
      wasm_module : wasm_module;
      mode : { #reinstall; #upgrade; #install };
      canister_id : canister_id;
    } -> async ();

    start_canister : shared { canister_id : canister_id } -> async ();

    stop_canister : shared { canister_id : canister_id } -> async ();

    uninstall_code : shared { canister_id : canister_id } -> async ();

    update_settings : shared {
      canister_id : Principal;
      settings : canister_settings;
    } -> async ();

  };

};

//34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo
