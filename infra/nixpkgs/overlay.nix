final: prev: {
  livekit-cli = final.callPackage ./pkgs/livekit-cli/package.nix {
    go_1_22 = final.go_1_22;
  };
  dummy = builtins.trace "Overlay is being applied" prev.hello;
}