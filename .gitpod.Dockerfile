FROM gitpod/workspace-full

RUN git clone https://github.com/blockstack/stacks-blockchain.git

RUN yarn global add blockstack-cli --prefix /workspace/tools

ENV PATH=/workspace/tools/bin:$PATH

WORKDIR /workspace/tools
RUN git clone https://github.com/lgalabru/clarity-repl.git

WORKDIR /workspace/tools/clarity-repl
RUN cargo install --bin clarity-repl --path .

WORKDIR /workspace/tools
RUN git clone https://github.com/blockstack/stacks-blockchain

WORKDIR /workspace/tools/stacks-blockchain
RUN cd testnet/stacks-node; cargo build --bin stacks-node;


