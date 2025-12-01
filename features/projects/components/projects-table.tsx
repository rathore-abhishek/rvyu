"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CodeLink, Loader, UrlLink } from "@/components/icons";

interface Project {
  id: string;
  project: {
    id: string;
    name: string;
    description: string;
    liveLink: string;
    codeLink?: string | null;
    techStack: { label: string; image?: string | null }[];
  };
  userSaved: boolean;
}

interface ProjectsTableProps {
  projects: Project[];
  onProjectClick: (
    projectId: string,
    listProjectId: string,
    userSaved: boolean,
  ) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

const ProjectsTable = ({
  projects,
  onProjectClick,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: ProjectsTableProps) => {
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "project.name",
      header: "Project Name",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <button
            onClick={() =>
              onProjectClick(
                row.original.project.id,
                row.original.id,
                row.original.userSaved,
              )
            }
            className="text-left font-medium hover:underline"
          >
            {row.original.project.name}
          </button>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {row.original.project.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "project.techStack",
      header: "Tech Stack",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1.5">
          {row.original.project.techStack.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="bg-muted text-muted-foreground inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
            >
              {tech.label}
            </span>
          ))}
          {row.original.project.techStack.length > 3 && (
            <span className="text-muted-foreground text-xs">
              +{row.original.project.techStack.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Links",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon-sm" asChild>
            <a
              href={row.original.project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <UrlLink className="h-4 w-4" />
            </a>
          </Button>
          {row.original.project.codeLink && (
            <Button variant="ghost" size="icon-sm" asChild>
              <a
                href={row.original.project.codeLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <CodeLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() =>
                    onProjectClick(
                      row.original.project.id,
                      row.original.id,
                      row.original.userSaved,
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? (
              <>
                <Loader className="h-4 w-4" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
