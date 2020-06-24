FROM gitpod/workspace-full

USER gitpod
RUN yarn global add blockstack-cli --prefix ~/tools

ENV PATH="$HOME/tools/bin:$PATH"

WORKDIR ~/tools
RUN git clone https://github.com/lgalabru/clarity-repl.git

RUN cd clarity-repl; cargo install --bin clarity-repl --path .

WORKDIR ~/tools
RUN git clone https://github.com/blockstack/stacks-blockchain

WORKDIR ~/tools/stacks-blockchain
RUN cd testnet/stacks-node; cargo build --bin stacks-node;

USER root
