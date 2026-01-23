export interface ItemGalleryProps<Type> {
	items: Type[];
	rows: number;
	cols: number;
	itemView?: <Type>(item: Type) => JSX.Element;
}