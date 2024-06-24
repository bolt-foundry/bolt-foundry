{ pkgs }: {
  deps = [
    pkgs.postgresql
  ];
  dev = {
    deps = with pkgs; [
      
    ];
  };
}