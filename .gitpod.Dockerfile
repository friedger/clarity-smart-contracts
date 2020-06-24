FROM gitpod/workspace-full

RUN git clone https://github.com/blockstack/stacks-blockchain.git

WORKDIR /blockstack

RUN yarn global add blockstack-cli --prefix /blockstack

RUN git clone https://github.com/lgalabru/clarity-repl.git

WORKDIR /blockstack/clarity-repl
RUN cargo install --bin clarity-repl --path .

WORKDIR /blockstack
RUN git clone https://github.com/blockstack/stacks-blockchain

WORKDIR /blockstack/stacks-blockchain
RUN cd testnet/stacks-node; cargo build --bin stacks-node;


