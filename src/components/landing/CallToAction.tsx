import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function CallToAction() {
    return (
        <section className="py-20 bg-amber-100">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Interested in building the future of workflow automation?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Join our open-source community and help shape the next
                    generation of intelligent workflow tools.
                </p>
                <div className="flex justify-center">
                    <Button size="lg" variant="default" asChild>
                        <Link to="/subscribe">
                            Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

