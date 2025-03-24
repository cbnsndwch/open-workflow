import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    useFormContext
} from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    // Create a default ID that can be used if itemContext is undefined
    const generatedId = React.useId();

    // Get contexts safely
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);

    // Check if we're inside a form context
    const formContext = useFormContext();

    if (!formContext) {
        console.warn('useFormField called outside of a FormProvider');
        // Return safe default values instead of throwing
        return {
            id: generatedId,
            name: '',
            formItemId: `${generatedId}-form-item`,
            formDescriptionId: `${generatedId}-form-item-description`,
            formMessageId: `${generatedId}-form-item-message`,
            invalid: false,
            isDirty: false,
            isTouched: false,
            error: undefined
        };
    }

    if (!fieldContext) {
        console.warn('useFormField called outside of a FormField');
        // Return safe default values instead of throwing
        return {
            id: generatedId,
            name: '',
            formItemId: `${generatedId}-form-item`,
            formDescriptionId: `${generatedId}-form-item-description`,
            formMessageId: `${generatedId}-form-item-message`,
            invalid: false,
            isDirty: false,
            isTouched: false,
            error: undefined
        };
    }

    // Safely destructure formContext with existence checks
    const getFieldState = formContext.getFieldState;
    const formState = formContext.formState;

    // Check if getFieldState and formState exist
    if (!getFieldState || !formState) {
        console.warn('getFieldState or formState is undefined in formContext');
        // Return safe default values
        return {
            id: itemContext?.id || generatedId,
            name: fieldContext.name,
            formItemId: `${itemContext?.id || generatedId}-form-item`,
            formDescriptionId: `${itemContext?.id || generatedId}-form-item-description`,
            formMessageId: `${itemContext?.id || generatedId}-form-item-message`,
            invalid: false,
            isDirty: false,
            isTouched: false,
            error: undefined
        };
    }

    // Safe field state access with explicit type matching to fix the error
    let fieldState = {
        invalid: false,
        isDirty: false,
        isTouched: false,
        error: undefined
    };

    try {
        if (fieldContext.name && typeof getFieldState === 'function') {
            // Get the field state from react-hook-form
            const hookFormFieldState = getFieldState(
                fieldContext.name,
                formState
            );

            // Map properties ensuring error is always defined (even if undefined)
            fieldState = {
                invalid: hookFormFieldState.invalid,
                isDirty: hookFormFieldState.isDirty,
                isTouched: hookFormFieldState.isTouched,
                error: hookFormFieldState.error || undefined
            };
        }
    } catch (error) {
        console.error('Error getting field state:', error);
    }

    // Safe ID extraction
    const id = itemContext?.id || generatedId;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue | undefined>(
    undefined
);

const FormItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div ref={ref} className={cn('space-y-2', className)} {...props} />
        </FormItemContext.Provider>
    );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(error && 'text-destructive', className)}
            htmlFor={formItemId}
            {...props}
        />
    );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn('text-sm font-medium text-destructive', className)}
            {...props}
        >
            {body}
        </p>
    );
});
FormMessage.displayName = 'FormMessage';

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField
};
