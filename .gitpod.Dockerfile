FROM gitpod/workspace-full

USER gitpod
RUN mkdir ~/tools
RUN yarn global add blockstack-cli --prefix ~/tools

ENV PATH="$HOME/tools/bin:$PATH"

WORKDIR ~/tools
RUN cd ~/tools; git clone https://github.com/blockstack/stacks-blockchain

WORKDIR ~/tools/stacks-blockchain
RUN cd testnet/stacks-node; cargo build --bin stacks-node;

USER root
