function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class GameMachine {
    constructor(machineMoney) {
        this.machineMoney = machineMoney;
    }

   get getTotalAmountOfMoney() {
        return console.log(this.machineMoney)
    }

    withdrawalMoney(money) {
        if (this.machineMoney >= money) {
            this.machineMoney -= money

        } else if (this.machineMoney < money) {
            if (confirm(`game machine don't have enough money for you withdrawal. It has only${this.machineMoney}$. Do you want to withdrawal all money?`)) {
                this.machineMoney -= this.machineMoney
            } else {
                console.log(`withdrawal declined. Game machine balance: ${this.machineMoney}$`)
            }
        }
        return console.log(`Game machine balance: ${this.machineMoney}$`)
    }

    addMoneyToGameMachine(money) {
        this.machineMoney += money
        return console.log(this.machineMoney)
    }

    playThisGameMachine(playersMoney) {
        this.machineMoney += playersMoney
        let firstNumber = getRandomInt(4)
        let secondNumber = getRandomInt(4)
        let thirdNumber = getRandomInt(4)


        if (firstNumber === secondNumber && secondNumber === thirdNumber) {
            console.log(firstNumber, secondNumber, thirdNumber)
            this.machineMoney -= (playersMoney * 3)

            console.log(`Jackpot! player win: ${playersMoney * 3}$`)
            return playersMoney * 3

        } else if (firstNumber === secondNumber || secondNumber === thirdNumber || firstNumber === thirdNumber) {
            console.log(firstNumber, secondNumber, thirdNumber)
            console.log(`player win: ${playersMoney * 2}$`)
            this.machineMoney -= (playersMoney * 2)

            console.log(this.machineMoney, 'machine balance')
            return playersMoney * 2

        } else {
            this.machineMoney += playersMoney

            console.log(`Player lose ${playersMoney}$`)
            return -playersMoney
        }


    }
}




class Casino {
    constructor(name) {
        this.name = name
        this.casinoMachines = []

    }

     get getMachineCount() {

        return console.log(this.casinoMachines.length)

    }

     get getMoney() {
        let totalCasinoMoney = this.casinoMachines.reduce((acc, gameMachine) => acc + gameMachine.machineMoney, 0)
        if (totalCasinoMoney < 0) {
            totalCasinoMoney = 0
        }
        return console.log(totalCasinoMoney)
    }
}


class User {
    constructor(name, money) {
        this.name = name
        this.money = money
        this.selectedGameMachine = null
    }

    selectGameMachine(gameMachine) {
        return this.selectedGameMachine = gameMachine

    }

    play(money) {
        if (this.money >= money) {

            let resultOfTheGame = this.selectedGameMachine.playThisGameMachine(money)
            this.money += (resultOfTheGame)
            if (this.money < 0) {
                this.money = 0
            }
            return this.money
        } else if (this.money < money) {
            return console.log('You do not have enough money')
        }


    }

}

const user1 = new User("Igor", 2000)


class SuperAdmin extends User {
    constructor(name, money) {
        super(name, money);
        this.casinos = []
    }

    createNewCasino(casinoName) {

        let casino = new Casino(casinoName)
        this.casinos.push(casino)
        console.log(`${casinoName} created`)
        return casino

    }

    createNewGameMachine(moneyForGameMachine, casinoId) {
        if(moneyForGameMachine > this.money){
            console.error('You do not have enough money for creating new game machine')
            return
        }
        let gameMachine = new GameMachine(moneyForGameMachine)

        this.money -= moneyForGameMachine
        this.casinos[casinoId].casinoMachines.push(gameMachine)
        console.log(`After creating new gameMachine superAdmin's balance is ${this.money}$ `)

    }

    takeMoneyFromCasino(number, casinoId) {

        let casinosGameMachine = this.casinos[casinoId].casinoMachines
        let casinoMachinesMoney = []

        casinosGameMachine.map((el) => casinoMachinesMoney.push(el.machineMoney))

        let sortedCasinoMachine = casinoMachinesMoney.sort((a, b) => b - a)
        let casinoBank = sortedCasinoMachine.reduce((acc, machineMoney) => acc + machineMoney)


        if (number > casinoBank) {
            console.error(`Sorry, but Casino do not have enough money for you withdrawal. Casino bank is only ${casinoBank}$`)
            return
        }


        let casinoGiveMoney = sortedCasinoMachine.map((gameMachineMoney) => {
            if (number >= gameMachineMoney) {
                number = number - gameMachineMoney
                gameMachineMoney -= number
                gameMachineMoney = 0

            } else if (gameMachineMoney > number) {
                gameMachineMoney -= number
                number = 0
            }

            return gameMachineMoney
        })
        // casinoGiveMoney.reverse()
        for (let i = 0; i < casinoGiveMoney.length; i++) {
            this.casinos[casinoId].casinoMachines[i].machineMoney = casinoGiveMoney[i]

        }
        console.log(this.casinos)

    }

    addMoneyToCasino(casinoId, addMoney) {

        if (addMoney > this.money) {
            console.log('You do not have enough money')
            return
        }
        this.money -= addMoney;
        let moneyForEachMachine = addMoney / this.casinos[casinoId].casinoMachines.length

        this.casinos[casinoId].casinoMachines.forEach((machine) => {
            machine.machineMoney += moneyForEachMachine
        })
        console.log(this.casinos)
        return this.casinos

    }

    addMoneyToGameMachine(casinoId, gameMachineId, addMoney) {

        if (addMoney > this.money) {
            console.log('You do not have enough money')
            return
        }
        this.money -= addMoney;
        console.log(this.casinos)
        this.casinos[casinoId].casinoMachines[gameMachineId].machineMoney += addMoney
        return this.casinos

    }

    removeGameMachine(casinoId, gameMachineId) {
        let deletedMachineMoney = this.casinos[casinoId].casinoMachines[gameMachineId].machineMoney
        let result = deletedMachineMoney / (this.casinos[casinoId].casinoMachines.length - 1)
        this.casinos[casinoId].casinoMachines.splice(gameMachineId, 1)
        this.casinos[casinoId].casinoMachines.forEach((el) => {
            el.machineMoney += Math.ceil(result)
        })
    }

}

const superAdmin1 = new SuperAdmin('Igor', 100000)
let myCasino = superAdmin1.createNewCasino('CasinoLotto')

// let gameMachine = superAdmin1.createNewGameMachine(1000, 0)
// let gameMachine2 = superAdmin1.createNewGameMachine(1001, 0)
// let gameMachine3 = superAdmin1.createNewGameMachine(1002, 0)
// let gameMachine5 = superAdmin1.createNewGameMachine(1004, 0)
// let gameMachine6 = superAdmin1.createNewGameMachine(1005, 0)
// let gameMachine7 = superAdmin1.createNewGameMachine(1006, 0)

// superAdmin1.addMoneyToCasino(0, 0, 2000)
// superAdmin1.addMoneyToCasino(0, 1, 2000)
// superAdmin1.takeMoneyFromCasino(4000,0)
// myCasino.getMoney
// myCasino.getMachineCount
// superAdmin1.removeGameMachine(0,1)
// superAdmin1.addMoneyToCasino(0, 20000)
// superAdmin1.addMoneyToGameMachine(0,0,20000)


