"use client";

import { Login03Icon, Logout03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session?.user)
    return (
      <Button variant="secondary">
        <Link href="/login" className="flex items-center gap-x-1">
          <HugeiconsIcon icon={Login03Icon} size={16} />
          Sign In
        </Link>
      </Button>
    );

  const { name, email, image } = session.user;

  const onSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onSignOut}>
            <HugeiconsIcon icon={Logout03Icon} size={16} />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
