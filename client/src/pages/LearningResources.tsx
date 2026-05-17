import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Leaf, BookMarked, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Resource {
  id: string;
  title: string;
  description: string;
  filename: string;
  icon: React.ReactNode;
}

interface ResourceWithCategory extends Resource {
  subcategory?: string;
}

const resources: Record<string, ResourceWithCategory[]> = {
  creation: [
    // Ocean
    {
      id: 'shark',
      title: 'White Shark: Ocean Icon',
      description: 'Discover the powerful design and role of white sharks in God\'s ocean ecosystem.',
      filename: 'whiteshark-gods-creation.pdf',
      icon: <Leaf className="w-6 h-6" />,
      subcategory: 'Ocean',
    },
    {
      id: 'whale',
      title: 'Blue Whale: Endangered Giant',
      description: 'Learn about the largest animal on Earth and how we can protect God\'s creation.',
      filename: 'bluewhale-gods-creation.pdf',
      icon: <Leaf className="w-6 h-6" />,
      subcategory: 'Ocean',
    },
    {
      id: 'coral',
      title: 'Coral Reefs: Underwater Cities',
      description: 'Explore the intricate ecosystems God designed beneath the waves.',
      filename: 'coral-reefs-gods-creation.pdf',
      icon: <Leaf className="w-6 h-6" />,
      subcategory: 'Ocean',
    },
    // Land
    {
      id: 'lion',
      title: 'The Lion: King of the Savanna',
      description: 'Study the majesty and design of lions—symbols of strength in Scripture.',
      filename: 'lion-gods-creation.pdf',
      icon: <Leaf className="w-6 h-6" />,
      subcategory: 'Land',
    },
    {
      id: 'redwood',
      title: 'Redwood Trees: Living Towers',
      description: 'Marvel at the tallest trees on Earth and God\'s design for growth and endurance.',
      filename: 'redwood-gods-creation.pdf',
      icon: <Leaf className="w-6 h-6" />,
      subcategory: 'Land',
    },
    // Air
    {
      id: 'hummingbird',
      title: "Hummingbird: God's Tiny Wonder",
      description: 'Explore the incredible design and agility of hummingbirds—a testament to God\'s creation.',
      filename: 'hummingbird-gods-creation.pdf',
      icon: <Sparkles className="w-6 h-6" />,
      subcategory: 'Air',
    },
    {
      id: 'eagle',
      title: 'Bald Eagle: Soaring on Wings',
      description: 'Discover how eagles reflect Isaiah 40:31—those who hope in the Lord will soar.',
      filename: 'eagle-gods-creation.pdf',
      icon: <Sparkles className="w-6 h-6" />,
      subcategory: 'Air',
    },
  ],
  bible: [
    {
      id: 'genesis',
      title: 'Genesis: The Book of Beginnings',
      description: 'Study the foundation of God\'s redemptive story and His covenant with His people.',
      filename: 'genesis-bible.pdf',
      icon: <BookMarked className="w-6 h-6" />,
    },
    {
      id: 'overview',
      title: 'The Bible at a Glance',
      description: 'A comprehensive overview of Scripture—66 books, one story, eternal purpose.',
      filename: 'bible-overview.pdf',
      icon: <BookMarked className="w-6 h-6" />,
    },
    {
      id: 'psalms',
      title: 'Psalms: Songs of Praise',
      description: 'Explore the poetry and prayers that have guided believers for thousands of years.',
      filename: 'psalms-bible.pdf',
      icon: <BookMarked className="w-6 h-6" />,
    },
    {
      id: 'proverbs',
      title: 'Proverbs: Wisdom for Life',
      description: 'Practical wisdom from King Solomon for daily living and decision-making.',
      filename: 'proverbs-bible.pdf',
      icon: <BookMarked className="w-6 h-6" />,
    },
  ],
  explorer: [
    {
      id: 'explorers-faith',
      title: 'Explorers of Faith',
      description: 'Meet Christian explorers and missionaries who changed the world through courage and faith.',
      filename: 'explorers-of-faith.pdf',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: 'biblical-lands',
      title: 'Biblical Lands Explorer',
      description: 'Journey through the geography of the Bible—from the Jordan River to Mount Sinai.',
      filename: 'biblical-lands-explorer.pdf',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: 'creation-science',
      title: 'Creation Science Discovery',
      description: 'Explore scientific evidence that points to an intelligent Creator.',
      filename: 'creation-science-explorer.pdf',
      icon: <BookOpen className="w-6 h-6" />,
    },
  ],
  activity: [
    {
      id: 'bible-crossword',
      title: 'Bible Crossword Puzzles',
      description: 'Fun crossword puzzles based on Bible stories and characters.',
      filename: 'bible-crossword-activity.pdf',
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: 'creation-coloring',
      title: 'Creation Coloring Pages',
      description: 'Beautiful coloring pages celebrating the 7 days of creation.',
      filename: 'creation-coloring-activity.pdf',
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: 'scripture-memory',
      title: 'Scripture Memory Cards',
      description: 'Printable memory verse cards for children to learn key Bible passages.',
      filename: 'scripture-memory-activity.pdf',
      icon: <Sparkles className="w-6 h-6" />,
    },
  ],
};

const categories = [
  { key: 'creation', label: "God's Creation", icon: Leaf },
  { key: 'bible', label: 'Bible', icon: BookMarked },
  { key: 'explorer', label: 'Explorer Pages', icon: BookOpen },
  { key: 'activity', label: 'Activity Pages', icon: Sparkles },
];

function ResourceCard({ resource }: { resource: ResourceWithCategory }) {
  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900">{resource.title}</CardTitle>
            <CardDescription className="mt-2 text-gray-600">{resource.description}</CardDescription>
          </div>
          <div className="text-[#6EBE44]">{resource.icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        {resource.filename ? (
          <a
            href={`/manus-storage/${resource.filename}`}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#6EBE44] text-white rounded-lg font-semibold hover:bg-[#5aa838] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        ) : (
          <div className="text-sm text-gray-500 italic">Coming soon...</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LearningResources() {
  const [activeCategory, setActiveCategory] = useState('creation');

  const currentResources = resources[activeCategory] || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#0055A4] text-white py-12 md:py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Learning Resources</h1>
          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto mb-4">
            Explore educational materials designed to deepen faith, understanding, and appreciation for God's creation.
          </p>
          <div className="h-1 w-20 bg-[#6EBE44] mx-auto"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-[#6EBE44] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-[#6EBE44] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Resources Grid with Subcategory Headers */}
        {activeCategory === 'creation' ? (
          <div className="space-y-10 mb-12">
            {['Ocean', 'Land', 'Air'].map((sub) => {
              const subResources = currentResources.filter((r) => r.subcategory === sub);
              if (subResources.length === 0) return null;
              return (
                <div key={sub}>
                  <h3 className="text-xl font-bold text-[#002855] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#6EBE44]/10 flex items-center justify-center text-[#6EBE44] text-sm font-bold">
                      {sub === 'Ocean' ? '🌊' : sub === 'Land' ? '🌍' : '🦅'}
                    </span>
                    {sub}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#6EBE44]/10 to-[#0055A4]/10 border border-[#6EBE44]/20 rounded-lg p-8 md:p-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Share These Resources</h2>
            <p className="text-gray-600">Help parents, teachers, and students discover the power of faith-centered education.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/welcome">
              <Button className="bg-[#002855] hover:bg-[#003d7a] text-white gap-2">
                Learn Our Mission
              </Button>
            </Link>
            <Link href="/membership">
              <Button variant="outline" className="border-[#6EBE44] text-[#6EBE44] hover:bg-[#6EBE44]/5">
                List Your School
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
