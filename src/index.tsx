import {Diff} from "utility-types";

type BusinessType = {};
interface OurProps<T> { remoteData: T }

type Success<T, Injected extends object, Wrapped extends Injected> = (
    x: T,
    WrappedComponent: (foo: Wrapped) => void,
    restProps: Diff<Wrapped, Injected>
) => void;

const withRemote = <T, Injected extends object, Wrapped extends Injected>
    (success: Success<T, Injected, Wrapped>) =>
    (WrappedComponent: (foo: Wrapped) => void) => {
        const HOC: (foo: OurProps<T>) => void = props => {
            type RestProps = Diff<Wrapped, Injected>;
            const {remoteData, ...restProps} = props;

            return success(
                remoteData,
                WrappedComponent,
                restProps as RestProps // TOOD: why is this needed?
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
            WrappedComponent(props); // TODO: Why doesn't this work?
        }
    );
};


export interface Props {
    businessType: BusinessType;
    otherType: string;
}
const Component: (props: Props) => void = ({ businessType }) => {
    console.log(businessType);
};

const WrappedComponent = withBusinessType<Props>()(Component);
// The idea here is that component will now take
// Diff<Props, BusinessTypeInjectedProps> as its props.
// So you only have to pass in 
console.log(WrappedComponent);
