# CDK Automatic1111 EC2

install deps

```bash
$ cd infra
$ npm i
```

toml 파일 수정 후 복사하기

```bash
$ cp config/dev.toml .toml
```

cdk 설치

```bash
$ cdk deploy "*" --require-approval never
```

접속 on cloudshell

```sh
$ aws ssm start-session --target i-000000000000
```

의존성 설치

```sh
$ sudo dnf install git-lfs tmux kernel-modules-extra.x86_64 kernel-devel gcc wget git python3 gperftools-libs libglvnd-glx -y
```

nvidia driver 설치

```sh
$ cd
$ wget https://us.download.nvidia.com/tesla/525.147.05/NVIDIA-Linux-x86_64-525.147.05.run
$ sudo sh NVIDIA-Linux-x86_64-525.147.05.run
```

webui 스크립트 실행

```sh
$ wget -q https://raw.githubusercontent.com/AUTOMATIC1111/stable-diffusion-webui/master/webui.sh
$ COMMANDLINE_ARGS="--listen --xformers" sh webui.sh
```

모델파일 설치 (git lfs)

```sh
$ cd stable-diffusion-webui/models/Stable-Diffusion
$ git lfs install
$ git clone https://huggingface.co/stabilityai/sdxl-turbo
```
