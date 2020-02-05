import React, { PropsWithChildren } from "react";
import {Diff} from "utility-types";

type BusinessType = {};
interface OurProps<T> { remoteData: T }

type Success<T, Injected extends object, Wrapped extends Injected> = (
    x: T,
    WrappedComponent: React.ComponentType<Wrapped>,
    restProps: PropsWithChildren<Diff<Wrapped, Injected>>
) => JSX.Element;

const withRemote = <T, Injected extends object, Wrapped extends Injected>
    (success: Success<T, Injected, Wrapped>) =>
    (WrappedComponent: React.ComponentType<Wrapped>) => {
        const HOC: React.FunctionComponent<OurProps<T>> = props => {
            type RestProps = Diff<Wrapped, Injected>;
            const {remoteData, ...restProps} = props;

            return success(
                props.remoteData,
                WrappedComponent,
                restProps as RestProps // TODO: Why do I need this?
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
            return <WrappedComponent {...props} />; // TODO: Why doesn't this work?
        }
    );
};


export interface Props {
    businessType: BusinessType;
    otherType: string;
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

const WrappedComponent = withBusinessType<Props>()(Component);
// The idea here is that component will now take
// Diff<Props, BusinessTypeInjectedProps> as its props.
// So you only have to pass in 
console.log(WrappedComponent);
