import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Calendar, Plus } from "@/components/icons";

const ListDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // Mock data - replace with actual data fetching
  const listData = {
    id,
    name: "Frontend Development Projects",
    description:
      "A curated list of outstanding frontend development projects for review and feedback",
    createdAt: new Date(),
    projectsCount: 12,
  };

  // Mock submitted projects - replace with actual data
  const submittedProjects = [
    {
      id: "1",
      name: "Portfolio Website Redesign",
      description:
        "Modern portfolio website built with Next.js and Tailwind CSS featuring smooth animations",
      submittedBy: {
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      },
      submittedAt: new Date(),
      status: "pending",
      url: "https://example.com",
      ogImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      techStack: ["Next.js", "Tailwind CSS", "TypeScript"],
    },
    {
      id: "2",
      name: "E-commerce Dashboard",
      description:
        "Admin dashboard for managing products, orders, and customers with real-time analytics",
      submittedBy: {
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      },
      submittedAt: new Date(),
      status: "reviewed",
      url: "https://example.com",
      ogImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      techStack: ["React", "Node.js", "MongoDB"],
    },
    {
      id: "3",
      name: "Task Management App",
      description:
        "Collaborative task management application with drag-and-drop functionality",
      submittedBy: {
        name: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      },
      submittedAt: new Date(),
      status: "pending",
      url: "https://example.com",
      ogImage:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop",
      techStack: ["Vue.js", "Firebase", "Vuetify"],
    },
  ];

  return (
    <div className="container mx-auto mt-6 mb-32 max-w-6xl space-y-8 px-6">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Title and Submit Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-semibold tracking-wider sm:text-4xl">
              {listData.name}
            </h1>
            {listData.description && (
              <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
                {listData.description}
              </p>
            )}
          </div>
          <Button className="shrink-0" size="default">
            <Plus className="h-4 w-4" />
            Submit Project
          </Button>
        </div>

        {/* Stats */}
        <div className="bg-card flex items-center gap-6 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              Created {listData.createdAt.toLocaleDateString()}
            </span>
          </div>
          <div className="text-muted-foreground text-sm">
            <span className="text-foreground font-semibold">
              {submittedProjects.length}
            </span>{" "}
            submitted projects
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-wider">
            Submitted Projects
          </h2>
          <p className="text-muted-foreground text-sm">
            Review and provide feedback on submitted projects
          </p>
        </div>

        {/* Projects Grid */}
        {submittedProjects.length === 0 ? (
          <div className="bg-card flex flex-col items-center justify-center rounded-xl border p-12 text-center">
            <div className="text-muted-foreground mb-2 text-lg font-medium">
              No projects yet
            </div>
            <p className="text-muted-foreground text-sm">
              Be the first to submit a project to this list
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submittedProjects.map((project) => (
              <article
                key={project.id}
                className="group bg-card hover:shadow-primary/5 relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-shadow"
              >
                {/* Gradient overlay on hover */}
                <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Open Graph Image */}
                <div className="bg-muted relative aspect-video w-full overflow-hidden">
                  <Image
                    src={project.ogImage}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Status badge overlay */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
                        project.status === "reviewed"
                          ? "bg-primary/90 text-primary-foreground"
                          : "bg-muted/90 text-foreground"
                      }`}
                    >
                      {project.status === "reviewed"
                        ? "Reviewed"
                        : "Pending Review"}
                    </span>
                  </div>
                </div>

                <div className="relative flex flex-col gap-4 p-5">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-lg leading-tight font-semibold tracking-tight">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-primary/5 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer - User and Date */}
                  <div className="flex items-center justify-between border-t pt-3">
                    {/* User info */}
                    <div className="flex items-center gap-2">
                      <div className="bg-muted relative h-6 w-6 overflow-hidden rounded-full">
                        <Image
                          src={project.submittedBy.avatar}
                          alt={project.submittedBy.name}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <span className="text-muted-foreground text-xs font-medium">
                        {project.submittedBy.name}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{project.submittedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDetails;
