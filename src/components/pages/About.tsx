import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export function About() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="pt-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Mission Section */}
        <section className="mb-20">
          <h1 className="mb-8">About Wavelength</h1>
          <div className="space-y-6 text-lg">
            <p>
              Wavelength is an independent online radio station dedicated to showcasing
              underground music and emerging artists from around the world. Since 2020,
              we've been broadcasting 24/7, bringing you sounds you won't hear anywhere
              else.
            </p>
            <p>
              Our mission is simple: to connect listeners with innovative music and
              create a global community of curious ears. From ambient soundscapes to
              cutting-edge electronic, jazz explorations to global rhythms, we're here
              to expand your musical horizons.
            </p>
            <p>
              We believe in the power of radio to bring people together, to discover
              new perspectives, and to celebrate the diversity of human creativity.
              Every show is an invitation to explore something new.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="mb-3">Community</h3>
              <p className="text-muted-foreground">
                Building connections between artists and listeners across the globe.
              </p>
            </div>
            <div>
              <h3 className="mb-3">Discovery</h3>
              <p className="text-muted-foreground">
                Championing emerging artists and uncovering hidden musical gems.
              </p>
            </div>
            <div>
              <h3 className="mb-3">Quality</h3>
              <p className="text-muted-foreground">
                Curating exceptional programming with care and attention to detail.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-muted-foreground mb-8">
                Have a question, suggestion, or want to get involved? We'd love to hear
                from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="mb-1">Email</p>
                    <a
                      href="mailto:hello@wavelength.radio"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      hello@wavelength.radio
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="mb-1">Location</p>
                    <p className="text-muted-foreground">Broadcasting from everywhere</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
