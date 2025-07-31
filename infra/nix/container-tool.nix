{ pkgs, lib, stdenv, fetchurl, undmg }:

stdenv.mkDerivation rec {
  pname = "apple-container";
  version = "0.3.0";

  src = fetchurl {
    url = "https://github.com/apple/container/releases/download/${version}/container-${version}-installer-signed.pkg";
    sha256 = "sha256-D3oAhATmZhGA6mehw6UEAY5Xwu8jjvTNqNcPKBUWxuY=";
  };

  nativeBuildInputs = [ pkgs.xar pkgs.cpio ];

  unpackPhase = ''
    xar -xf $src
    cat Payload | gunzip -dc | cpio -i
  '';

  installPhase = ''
    mkdir -p $out
    cp -R bin $out/
    cp -R libexec $out/
  '';

  meta = with lib; {
    description = "Apple's container runtime";
    homepage = "https://github.com/apple/container";
    license = licenses.asl20;
    platforms = [ "aarch64-darwin" "x86_64-darwin" ];
  };
}