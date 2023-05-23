import Ukraine, { IUkraineOptions } from 'save-ukraine';

export function SaveUkraine(props: Partial<Omit<IUkraineOptions, 'element'>>) {
    return (
        <div
            ref={(element) => {
                if (!element) {
                    return;
                }
                Ukraine.save({ element, ...props });
            }}
        />
    );
}