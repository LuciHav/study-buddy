import { Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NavButton from "./NavButton";

export default function TutorCard({ tutor }) {
  return (
    <Card className="w-full m-auto max-w-3xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            className="object-cover"
            src={`${import.meta.env.VITE_SERVER_URL}/${tutor.image}`}
            alt={`${tutor.firstName} ${tutor.lastName}`}
          />
          <AvatarFallback>
            {tutor.firstName[0]}
            {tutor.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">
            {tutor.firstName} {tutor.lastName}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{tutor.address}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{tutor.bio}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {tutor.subject.map((subject, index) => (
              <Badge key={index} variant="secondary">
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        {tutor.experience && tutor.experience.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Experience</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {tutor.experience.map((exp, index) => (
                <li key={index}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{tutor.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{tutor.phone}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Hourly Rate</div>
          <div className="text-2xl font-bold">Rs {tutor.hourlyRate}/hr</div>
          <NavButton to={`${tutor.id}`}>Booking</NavButton>
        </div>
      </CardContent>
    </Card>
  );
}
