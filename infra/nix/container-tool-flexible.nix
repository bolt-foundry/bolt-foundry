# Flexible container tool package that can be overridden with different versions
# Usage in flake.nix:
#   containerTool = pkgs.callPackage ./infra/nix/container-tool-flexible.nix {
#     version = "0.3.0";  # or any other version
#   };

{ pkgs, lib, stdenv, fetchurl, version ? "0.3.0" }:

let
  # Map of known versions to their hashes
  versionHashes = {
    "0.3.0" = "sha256-D3oAhATmZhGA6mesPDpQQBjlfC7yOO9M2o1w8oFRbG5m";
    # Add more versions here as they're released
  };

  sha256 = versionHashes.${version} or (throw "Unknown container version: ${version}. Please add the hash to versionHashes.");
in
stdenv.mkDerivation rec {
  pname = "apple-container";
  inherit version;

  src = fetchurl {
    url = "https://github.com/apple/container/releases/download/${version}/container-${version}-installer-signed.pkg";
    inherit sha256;
  };

  nativeBuildInputs = [ pkgs.xar pkgs.cpio ];

  unpackPhase = ''
    xar -xf $src
    cd com.apple.pkg.container
    cat Payload | gunzip -dc | cpio -i
  '';

  installPhase = ''
    mkdir -p $out
    cp -R usr/* $out/
  '';

  meta = with lib; {
    description = "Apple's container runtime (version ${version})";
    homepage = "https://github.com/apple/container";
    license = licenses.asl20;
    platforms = [ "aarch64-darwin" "x86_64-darwin" ];
  };
}