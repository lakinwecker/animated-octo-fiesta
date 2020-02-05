import {Diff} from "utility-types";

// The point of this function is partial application, where the parameters
// and their partial application is embedded within an object.
//
// If we were using function parameters directly this would be:
// withParam1 -> String -> (String -> String -> String) -> (String -> String)
// 
// The reason why the first parameter is callback is that in the real world
// example it's actually more complicated than this.
const withParam1 = <Injected extends object, Wrapped extends Injected>
    (param1Generator: () => string) => {
    type RemainingProps = Diff<Wrapped, Injected>;
    return (otherFunc: (fullProps: Wrapped) => void) =>
        (remainingProps: RemainingProps) => {
            const param1 = param1Generator();
            const props = {param1, ...remainingProps} as Wrapped; // Why do I need this cast?
            return otherFunc(props);
        };
};

interface InjectedProps {
    param1: string;
};
interface Props {
    param1: string;
    param2: string;
};

const component = (props: Props) => `Hello ${props.param1} from ${props.param2}`;
function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
const randomName = () => {
    return [
        "Lakin",
        "Someone",
        "Peter",
        "Paul"
    ][getRandomInt(3)];
};

const HelloRandom = withParam1<InjectedProps, Props>(randomName)(component);
console.log(HelloRandom({param2: "STRABS"}));
