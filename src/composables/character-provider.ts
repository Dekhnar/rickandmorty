export enum CharacterListScope {
    list = "List",
    search = "Search",
}

export const CurrentCharacterListContext = Symbol('character-list-context');

export default function useCharacterListContext(): CharacterListScope {
    return inject(CurrentCharacterListContext) as CharacterListScope;
}
