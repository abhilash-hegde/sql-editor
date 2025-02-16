import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EXPORT_FORMATS } from "@/constants/download";

export default function ExportButton({
  disabled = false,
  exportDataHandler,
  exportText = "Export",
  loadingFormat = {},
  variant = "default",
}) {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger disabled={disabled} asChild>
        <Button variant={variant}>{exportText}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => exportDataHandler(EXPORT_FORMATS.json)}
        >
          {loadingFormat[EXPORT_FORMATS.json]
            ? "Exporting as JSON..."
            : "Export as JSON"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportDataHandler(EXPORT_FORMATS.csv)}>
          {loadingFormat[EXPORT_FORMATS.csv]
            ? "Exporting as CSV..."
            : "Export as CSV"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportDataHandler(EXPORT_FORMATS.xlsx)}
        >
          {loadingFormat[EXPORT_FORMATS.xlsx]
            ? "Exporting as Excel..."
            : "Export as Excel"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
