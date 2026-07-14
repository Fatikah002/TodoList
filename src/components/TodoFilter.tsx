import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TodoFilterProps = {
  value: string;
  onChange: (value: string) => void;
  categories: readonly string[];
};

export function TodoFilter({ value, onChange, categories }: TodoFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {/* <Label>Filter :</Label> */}
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue ?? "All")}>
        <SelectTrigger className="h-15 w-16 rounded-full border-1 border-green-500  hover:bg-green-600  text-green-500 data-[placeholder]: [&>svg]:text-green-500">
          {" "}
          <SelectValue placeholder="Filter category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
