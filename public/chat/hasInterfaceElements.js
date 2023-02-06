class hasInterfaceElements{
    constructor(interfaceElements, slug) {
        this.interfaceElements = interfaceElements;
        this.slug = slug;
    }

    getInterfaceElementByName(name){
        return this.interfaceElements[name];
    }
}

export default hasInterfaceElements;