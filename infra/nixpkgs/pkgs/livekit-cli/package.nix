{ lib
, buildGoModule
, fetchFromGitHub
 , go_1_22
}:
buildGoModule.override { go = go_1_22; } rec {
  pname = "livekit-cli";
  version = "2.2.1";
  src = fetchFromGitHub {
    owner = "livekit";
    repo = "livekit-cli";
    rev = "v${version}";
    hash = "sha256-yt3alb2/0QXTQ6bk5IsRTQDOm77r53JXunJ7lTYwNYQ=";
  };
  vendorHash = "sha256-1Q/N0FwtJ27552E1j7kdkhPohASHTf+gy6L4QhHwK2g=";
  
  meta = with lib; {
    description = "Command line interface to LiveKit";
    homepage = "https://livekit.io/";
    license = licenses.asl20;
    mainProgram = "livekit-cli";
  };
}