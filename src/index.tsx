import React, { PropsWithChildren } from "react";
import {Diff} from "utility-types";

type BusinessType = {};
interface OurProps<T> { remoteData: T }

type Success<T, Injected extends object, Wrapped extends Injected> = (
    x: T,
    WrappedComponent: React.ComponentType<Injected>,
    restProps: PropsWithChildren<Diff<Wrapped, Injected>>
) => JSX.Element;

const withRemote = <T, Injected extends object, Wrapped extends Injected>
    (success: Success<T, Injected, Wrapped>) =>
    (WrappedComponent: React.ComponentType<Injected>) => {
        const HOC: React.FunctionComponent<OurProps<T>> = props => {
            type RestProps = Diff<Wrapped, Injected>;
            const {remoteData, ...restProps} = props;

            return success(
                props.remoteData,
                WrappedComponent,
                restProps as RestProps
            );
        };

        return HOC;
    };


interface BusinessTypeInjectedProps {
    businessType: BusinessType,
};
export const withBusinessType = function <Wrapped extends BusinessTypeInjectedProps>() {
    return withRemote<BusinessType, BusinessTypeInjectedProps, Wrapped>(
        (businessType, WrappedComponent, restProps) => {
            let props = {businessType: businessType, ...restProps};
            return <WrappedComponent {...props} />;
        }
    );
};


export interface Props {
    businessType: BusinessType;
    other: string;
}
const Component: React.FC<Props> = ({
    businessType,
}) => {
    console.log(businessType);

    return (
        <React.Fragment>
            <h1> Hello! </h1>
        </React.Fragment>
    );
};

function foo(a: BusinessTypeInjectedProps) {
    console.log(a.businessType);
}
const x: Props = {
    businessType: {},
    other: "foo"
};
foo(x);

const component = withBusinessType<Props>()(Component);
console.log(component);
