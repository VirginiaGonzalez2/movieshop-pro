"use client";

import Form from "next/form";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NavSearch() {
  return (
    <Form action="/search" className="flex items-center gap-2">
      <Input
        type="search"
        name="q"
        placeholder="Search..."
        className="w-48 bg-white"
      />

      <Button size="icon" variant="ghost" type="submit">
        <Search className="h-4 w-4" />
      </Button>
    </Form>
  );
}
