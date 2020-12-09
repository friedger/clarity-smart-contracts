FROM gitpod/workspace-full

USER gitpod
RUN mkdir ~/tools
RUN npm install --global @stacks/cli --prefix ~/tools

ENV PATH="$HOME/tools/bin:$PATH"
ENV PATH="$HOME/.cargo/bin:$PATH"

RUN cd ~/tools; git clone https://github.com/lgalabru/clarity-repl.git
RUN cd ~/tools/clarity-repl;cargo install --bin clarity-repl --path .

RUN cd ~/tools; git clone https://github.com/blockstack/stacks-blockchain
RUN cd ~/tools/stacks-blockchain/testnet/stacks-node;cargo build --release --bin stacks-node;

USER root
