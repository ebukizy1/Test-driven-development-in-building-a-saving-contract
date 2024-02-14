import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";


describe("Saving Contract Test", function () {


    const deploymentOfSavingContract = async () => {

    const depositAmount = ethers.parseEther("1.0");
    const addressZero = "0x0000000000000000000000000000000000000000";


    const [owner, otherAccount] = await ethers.getSigners();
    const SavingContract = await ethers.getContractFactory("SavingContract");
    const savingContract = await SavingContract.deploy();

    return { savingContract, owner, otherAccount, depositAmount, addressZero };
  };


  describe("Deployment", async () => {
    it("test that contract have been deployed", async () => {

      const { savingContract } = await loadFixture(deploymentOfSavingContract);
      assert.isNotNull(savingContract);
    });


  });

describe("Deposit Test ", async () => {
    it("test that contract can deposit funds", async () => {

      const { savingContract, owner ,depositAmount} = await loadFixture(
        deploymentOfSavingContract
      );
      await savingContract.deposit({ value: depositAmount });

      const ownerSavingBalance = await savingContract.savings(owner.address);
      expect(ownerSavingBalance).to.equal(depositAmount);
    });


    describe("Deposit validation check", async () => {

        it("test that address zero cannot deposit funds", async () => {
    
            const { savingContract, depositAmount, owner, addressZero } = await loadFixture(deploymentOfSavingContract);

            await savingContract.deposit({ value: depositAmount });
            
            expect(owner.address).is.not.equal(addressZero);
 
        });
    });

        it("test that the value of ether save must be greater 0", async () => {
            const { savingContract, depositAmount } = await loadFixture(deploymentOfSavingContract);
            await expect(savingContract.deposit({ value : 0 }))
                .to.be.revertedWith( "can't save zero value");
        });

    describe("Event test ", async ()=>{
        it("test that after depositing event can be emited", async () => {
                const { savingContract, depositAmount, owner } = await loadFixture(deploymentOfSavingContract);
                await expect(savingContract.deposit({ value: depositAmount }))
                  .to.emit(savingContract, 'SavingSuccessful')
                  .withArgs(owner.address, depositAmount);
              });
        } )
       


    describe("Withdrawal Test" ,async ()=>{
        it("test that address can withdraw funds ", async()=>{
            const { savingContract, depositAmount, owner } = await loadFixture(deploymentOfSavingContract);

            await savingContract.deposit({ value: depositAmount });

            const initialOwnerSavingBalance = await savingContract.savings(owner.address);

            expect(initialOwnerSavingBalance).to.equal(depositAmount);

            await savingContract.withdraw();
            const ownerSavingBalance = await savingContract.savings(owner.address);
            expect(ownerSavingBalance).to.equal(0);
            })
        })
    describe("Withdraw validation check ", async ()=>{
        it("test that address cannot be address zerol ,and address with no savings cannot call withdraw", async()=>{
            const { savingContract, owner } = await loadFixture(deploymentOfSavingContract);
            const addressZero = "0x0000000000000000000000000000000000000000";
            //address is not  zero address cannot withdraw
            expect(owner.address).is.not.equal(addressZero);

            await expect(savingContract.withdraw()).to.be.revertedWith("you don't have any savings");

            });
        });
    describe("Check Savings ", async()=>{
        it("test that balance can be checked ", async()=>{
            const { savingContract, owner ,depositAmount} = await loadFixture(deploymentOfSavingContract);
           await savingContract.deposit({value : depositAmount});
            const savingBalance = await savingContract.checkSavings(owner);
            expect(savingBalance).to.equal(depositAmount);
        });
    });

    describe("test sendOutSaving ", async()=>{
        it("test that saver can send amount to another person ", async()=>{
            const { savingContract, owner , otherAccount} = await loadFixture(deploymentOfSavingContract);
            const depositAmount = ethers.parseEther("2.0");
            await savingContract.deposit({value : depositAmount});

            const amountTransfered = ethers.parseEther("1.0");
            const initialOwnerSavingBalance = await savingContract.savings(owner.address);
            expect(initialOwnerSavingBalance).to.equal(depositAmount);

            await savingContract.sendOutSaving(otherAccount, amountTransfered);

            const ownerSavingBalance = await savingContract.savings(owner.address);

            expect(ownerSavingBalance).to.equal(amountTransfered);
    });

    describe("test sendOutSaving validation ", async()=>{
        it("test that address cannot be address zero ,and amount cannot be less than zero", async()=>{
            const { savingContract, owner, depositAmount, otherAccount } = await loadFixture(deploymentOfSavingContract);
            const addressZero = "0x0000000000000000000000000000000000000000";
            //address is not  zero address cannot withdraw
            expect(owner.address).is.not.equal(addressZero);

            await savingContract.deposit({value : depositAmount});

            
            const amountTransfered = ethers.parseEther("0.0");


            await expect(savingContract.sendOutSaving(otherAccount, amountTransfered)).to.be.rejectedWith("can't send zero value")

        })
    } )
    })




    })
        
          
});



   