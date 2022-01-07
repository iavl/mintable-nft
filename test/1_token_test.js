const { BN, shouldFail, time } = require('openzeppelin-test-helpers');
const { expect } = require('chai');
const Web3Utils = require('web3-utils');


const NFT = artifacts.require("NFT");

contract("NFT Test",   accounts => {
    const account0 = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];
    const account3 = accounts[3];
    const account4 = accounts[4];

    const BN0 = new BN(0);
    const BN1 = new BN(1);

    const hash1 = "QmUg8XofMgyv5vyGcB59qCFjxWuUMpEau54Fu6jW9SG5Hs1";
    const hash2 = "QmUg8XofMgyv5vyGcB59qCFjxWuUMpEau54Fu6jW9SG5Hs2";

    context('NFT test', function () {
        beforeEach(async function () {
            this.nft = await NFT.new("NFT name", "NFT symbol");
        });

        it("can mint only once", async function() {
            var name = await this.nft.name();
            var symbol = await this.nft.symbol();
            console.log("name: ", name);
            console.log("symbol: ", symbol);

            // account 1 mint
            await this.nft.mint(hash1, {from: account1});
            await shouldFail.reverting.withMessage(
                this.nft.mint(hash1, {from: account1}),
                "Already minted"
            );
            // check balance
            var balance = await this.nft.balanceOf(account1);
            expect(balance).to.be.bignumber.equal(BN1);

            // account 2 mint
            await this.nft.mint(hash2, {from: account2});
            await shouldFail.reverting.withMessage(
                this.nft.mint(hash2, {from: account2}),
                "Already minted"
            );
            // check balance
            var balance = await this.nft.balanceOf(account2);
            expect(balance).to.be.bignumber.equal(BN1);

            await this.nft.setBaseURI("ipfs://");
            var tokenURI = await this.nft.tokenURI(1);
            console.log("tokenURI: ", tokenURI.toString());
            var tokenURI = await this.nft.tokenURI(2);
            console.log("tokenURI: ", tokenURI.toString());

        });

        it("can't mint when paused", async function() {
            // Pause
            await this.nft.Pause();

            await shouldFail.reverting.withMessage(
                this.nft.mint(hash1, {from: account1}),
                "Pausable: paused"
            );

            // Unpause
            await this.nft.Unpause();
            // account 1 mint
            await this.nft.mint(hash1, {from: account1});

            // check balance
            var balance = await this.nft.balanceOf(account1);
            expect(balance).to.be.bignumber.equal(BN1);

        });

        it("transfer NFT", async function() {
            // account 1 mint
            await this.nft.mint(hash1, {from: account1});
            expect(await this.nft.ownerOf(1)).to.be.equal(account1);

            await this.nft.transferFrom(account1, account2, 1, {from: account1});

            // check balance
            var balanceAccount1 = await this.nft.balanceOf(account1);
            expect(balanceAccount1).to.be.bignumber.equal(BN0);
            var balanceAccount2 = await this.nft.balanceOf(account2);
            expect(balanceAccount2).to.be.bignumber.equal(BN1);

        });

        it("can't exceed MAX_SUPPLY", async function() {
            for (var i = 0; i < 1024; i++) {
                console.log(i);
                await this.nft.mint(hash1, {from: accounts[i]});
                expect(await this.nft.balanceOf(accounts[i])).to.be.bignumber.equal(BN1);
            }
            await shouldFail.reverting.withMessage(
                this.nft.mint(hash2, {from: accounts[1024]}),
                "Max supply exceeded"
            );
        }).timeout(36000000); // 10 hours

    });
});