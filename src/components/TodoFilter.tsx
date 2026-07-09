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
        <SelectTrigger className="h-10 w-[65px] rounded-full   bg-green-500 hover:bg-green-600  text-white data-[placeholder]: [&>svg]:text-white">
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
