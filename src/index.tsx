import React from "react";
import {Diff} from "utility-types";

type BusinessType = {};

interface IRemoteDataProps<T> {
    remoteData: T,
}

type Success<T, InjectedProps extends object, WrappedProps extends InjectedProps> = (
    x: T,
    WrappedComponent: React.ComponentType<WrappedProps>,
    restProps: Diff<WrappedProps, InjectedProps>
) => JSX.Element;

interface Args<T, InjectedProps extends object, WrappedProps extends InjectedProps> {
    success: Success<T, InjectedProps, WrappedProps>;
}
const withRemote = <T, InjectedProps extends object, WrappedProps extends InjectedProps>
    (impl: Args<T, InjectedProps, WrappedProps>) =>
    (WrappedComponent: React.ComponentType<WrappedProps>) => {
        type RestProps = Diff<WrappedProps, InjectedProps>;
        const HOC: React.FC<IRemoteDataProps<T>> = props => {
            const {remoteData, ...restProps} = props;

            return impl.success(
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
export const withBusinessType = function <WrappedProps extends BusinessTypeInjectedProps>() {
    return withRemote<BusinessType, BusinessTypeInjectedProps, WrappedProps>({
        success: (businessType, WrappedComponent, restProps) => {
            let props = {businessType: businessType, ...restProps};
            return <WrappedComponent {...props} />;
        }
    });
};
