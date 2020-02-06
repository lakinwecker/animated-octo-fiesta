import {Diff} from "utility-types";

// A type
interface Injected {
    param1: string;
};

// An extended type
interface Props {
    param1: string;
    param2: string;
};
// The difference between the two
type Remaining = Diff<Props, Injected>;

// We can use the type directly
const x: Props = {
    param1: "Param1",
    param2: "Param2"
};
console.log(x);

// We can compose the type from its component types directly
const i: Injected = {
    param1: "Param1",
};
const r: Remaining = {
    param2: "Param2",
};
const y: Props = {...i, ...r};
console.log(y);

// We can decompose adn then recompose even.
const {param1, ...r2} = x;
const y2: Props = {param1, ...r2};
console.log(y2);


// But we can't do it from a generic type declaration like this.
function doesntWork<Wrapped extends Injected>(p1: string) {
    type Remaining = Diff<Wrapped, Injected>;
    return (r: Remaining) => {
        // WHY? this line requires an `as Wrapped`
        const w: Wrapped = {param1: p1, ...r};
        console.log(w);
    }
}
doesntWork("FOO!")({param2: "BAR!"});


