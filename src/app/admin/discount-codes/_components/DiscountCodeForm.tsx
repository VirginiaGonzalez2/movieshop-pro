import { DiscountScope, DiscountType } from "@prisma/client";

type MovieOption = {
    id: number;
    title: string;
};

type DiscountCodeFormValue = {
    code: string;
    type: DiscountType;
    value: string;
    scope: DiscountScope;
    startsAt: string;
    endsAt: string;
    usageLimit: string;
    isActive: boolean;
    selectedMovieIds: number[];
};

type Props = {
    title: string;
    description: string;
    submitLabel: string;
    action: (formData: FormData) => Promise<void>;
    movies: MovieOption[];
    initialValue: DiscountCodeFormValue;
};

export default function DiscountCodeForm(props: Props) {
    return (
        <form action={props.action} className="space-y-5 rounded-lg border p-5 bg-card">
            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="code">
                    Discount Code
                </label>
                <input
                    id="code"
                    name="code"
                    defaultValue={props.initialValue.code}
                    placeholder="SUMMER20"
                    className="w-full rounded-md border p-2 uppercase"
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Use letters, numbers, dashes, or underscores.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="type">
                        Discount Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        defaultValue={props.initialValue.type}
                        className="w-full rounded-md border p-2"
                    >
                        <option value={DiscountType.PERCENTAGE}>Percentage (%)</option>
                        <option value={DiscountType.FIXED_AMOUNT}>Fixed Amount ($)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="value">
                        Discount Value
                    </label>
                    <input
                        id="value"
                        name="value"
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue={props.initialValue.value}
                        placeholder="10"
                        className="w-full rounded-md border p-2"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="scope">
                    Product Scope
                </label>
                <select
                    id="scope"
                    name="scope"
                    defaultValue={props.initialValue.scope}
                    className="w-full rounded-md border p-2"
                >
                    <option value={DiscountScope.ALL_PRODUCTS}>All products</option>
                    <option value={DiscountScope.SELECTED_PRODUCTS}>Selected products</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    If selected products is chosen, pick one or more movies below.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="startsAt">
                        Starts At
                    </label>
                    <input
                        id="startsAt"
                        name="startsAt"
                        type="datetime-local"
                        defaultValue={props.initialValue.startsAt}
                        className="w-full rounded-md border p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="endsAt">
                        Ends At
                    </label>
                    <input
                        id="endsAt"
                        name="endsAt"
                        type="datetime-local"
                        defaultValue={props.initialValue.endsAt}
                        className="w-full rounded-md border p-2"
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="usageLimit">
                        Usage Limit (optional)
                    </label>
                    <input
                        id="usageLimit"
                        name="usageLimit"
                        type="number"
                        min="1"
                        step="1"
                        defaultValue={props.initialValue.usageLimit}
                        placeholder="500"
                        className="w-full rounded-md border p-2"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Status</label>
                    <label className="flex items-center gap-2 rounded-md border p-2">
                        <input
                            name="isActive"
                            type="checkbox"
                            defaultChecked={props.initialValue.isActive}
                        />
                        <span className="text-sm">Code is active</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <div className="text-sm font-medium">Selected Products</div>
                <div className="max-h-64 overflow-auto rounded-md border p-3 space-y-2">
                    {props.movies.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No movies available yet.</p>
                    ) : (
                        props.movies.map((movie) => (
                            <label key={movie.id} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="movieIds"
                                    value={movie.id}
                                    defaultChecked={props.initialValue.selectedMovieIds.includes(
                                        movie.id,
                                    )}
                                />
                                <span>{movie.title}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold">{props.title}</h2>
                <p className="text-sm text-muted-foreground">{props.description}</p>
            </div>

            <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
            >
                {props.submitLabel}
            </button>
        </form>
    );
}
