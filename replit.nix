{ pkgs }: {
  deps = [
    pkgs.postgresql
  ];
  dev = {
    deps = with pkgs; [
      jq
      emscripten
      pkg-config
      clang_12
      ccls
      gdb
      gnumake
      emscripten
      watchman
      sapling
      gh
      jupyter
    ];
  };
}