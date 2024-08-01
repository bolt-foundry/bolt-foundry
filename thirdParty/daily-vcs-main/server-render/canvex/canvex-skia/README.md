# canvex-skia

Skia library used by canvex for rendering VCS graphics.

It's a complex dependency that uses Google's proprietary toolchain, so we provide prebuilt static libraries for each target (in `lib-static`).

## How to build

Follow the Skia download instructions in:

https://skia.org/docs/user/download/

On the top level, you'll have three directories:

* depot_tools
* skia
* gn_out

The first two are the repos that you pull in the "download" step linked above. `gn_out` is where the build products go.

When you've pulled the skia repo, don't forget these steps:
```
python3 tools/git-sync-deps
bin/fetch-ninja
```

The Skia build instructions are at https://skia.org/docs/user/build/ - but you shouldn't need to read these!

We provide a preconfigured build script under `skia-config` in this repo. So, go to your skia repo and copy the script into place:

```
cp {YOUR REPO}/pluot-core/vcs/server-render/canvex/canvex-skia/skia-config/canvex_skia_config_macos.sh .
```

...or for Linux, use the _linux version of the script.

Then run the script in the skia repo dir:

```
./canvex_skia_config_macos.sh
```

It should configure the build and give you instructions for what to do next.

## Updating the library version

The config scripts (like `canvex_skia_config_macos.sh`) are fixed to a commit id.

For the canvex C++ build, we provide a copy of the Skia `include` folder in this repo. It contains the C++ headers that match the Skia commit id.

If you're upgrading the library to a new version, you should:

* Update the commit id in all the scripts in `skia-config`
* Copy new versions of all the headers from `skia/include` into the `include` dir here
