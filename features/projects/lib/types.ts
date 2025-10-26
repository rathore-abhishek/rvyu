export interface Project {
  id: string;
  name: string;
  description: string;
  body?: string | null;
  liveLink: string;
  codeLink?: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  techStack: TechStack[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TechStack {
  id: string;
  label: string;
  image?: string | null;
}

export interface NewProject {
  name: string;
  description: string;
  body?: string;
  liveLink: string;
  codeLink?: string;
  visibility: "PUBLIC" | "PRIVATE";
  techStack: { label: string; image?: string }[];
}
