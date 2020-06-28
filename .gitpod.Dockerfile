FROM gitpod/workspace-full

USER gitpod
RUN mkdir ~/tools
RUN npm install --global git://github.com/blockstack/cli-blockstack.git#feature/stacks-2.0-tx --prefix ~/tools

ENV PATH="$HOME/tools/bin:$PATH"
ENV PATH="$HOME/.cargo/bin:$PATH"

RUN cd ~/tools; git clone https://github.com/lgalabru/clarity-repl.git
RUN cd ~/tools/clarity-repl;cargo install --bin clarity-repl --path .

RUN cd ~/tools; git clone https://github.com/blockstack/stacks-blockchain
RUN cd ~/tools/stacks-blockchain/testnet/stacks-node;cargo install --bin stacks-node --path .;

USER root
