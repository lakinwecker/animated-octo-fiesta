import React from "react";
import {Diff} from "utility-types";

type BusinessType = {};
interface OurProps<T> { remoteData: T }

type Success<T, Injected extends object, Wrapped extends Injected> = (
    x: T,
    WrappedComponent: React.ComponentType<Injected>,
    restProps: Diff<Wrapped, Injected>
) => JSX.Element;

const withRemote = <T, Injected extends object, Wrapped extends Injected>
    (success: Success<T, Injected, Wrapped>) =>
    (WrappedComponent: React.ComponentType<Injected>) => {
        type RestProps = Diff<Wrapped, Injected>;
        const HOC: React.FC<OurProps<T>> = props => {
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
    other: string,
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

const component = withBusinessType()(Component);
console.log(component);
