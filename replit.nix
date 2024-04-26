{ pkgs }: {
    deps = [
      pkgs.postgresql
      pkgs.cowsay
      pkgs.sapling
      pkgs.gh
    ];
}