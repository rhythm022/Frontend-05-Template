class Dog{
    aggressivity = 3

    attack(){
        return this.aggressivity
    }

}


class Person{
    HP = 100
    injured(hurt){
        this.HP = this.HP - hurt
    }
}


const aPerson = new Person()
const aDog = new Dog()


aPerson.injured(aDog.attack())
console.log(aPerson.HP)