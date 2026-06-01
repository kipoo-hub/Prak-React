import { useState } from 'react';
import PageHeader from '../components/PageHeader';

// Basic
import Button from '../components/Basic/Button';
import Icon from '../components/Basic/Icon';
import Text from '../components/Basic/Text';
import Image from '../components/Basic/Image';

// Layout
import Container from '../components/Layout/Container';
import Grid from '../components/Layout/Grid';
import Stack from '../components/Layout/Stack';

// Data Display
import Card from '../components/DataDisplay/Card';
import Table from '../components/DataDisplay/Table';
import List from '../components/DataDisplay/List';
import Tooltip from '../components/DataDisplay/Tooltip';

// Form
import Input from '../components/Form/Input';
import Select from '../components/Form/Select';
import Checkbox from '../components/Form/Checkbox';
import DatePicker from '../components/Form/DatePicker';

// Feedback
import Alert from '../components/Feedback/Alert';
import Modal from '../components/Feedback/Modal';
import Toast from '../components/Feedback/Toast';
import Spinner from '../components/Feedback/Spinner';

// Section
import HeroSection from '../components/Section/HeroSection';
import FAQSection from '../components/Section/FAQSection';
import PricingSection from '../components/Section/PricingSection';
import Footer from '../components/Section/Footer';

export default function Components() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const showToast = () => {
        setIsToastVisible(true);
        setTimeout(() => setIsToastVisible(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-8">
            <PageHeader title="Components" />
            <Text className="mb-8">Dashboard / Components</Text>

            <Container className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <Text variant="h2" className="mb-4">Komponen Playground</Text>
                <Text className="mb-12">Ini Halaman Components yang memuat berbagai komponen UI reusable.</Text>

                {/* 1. Basic Component */}
                <section className="mb-16">
                    <Text variant="h3" className="mb-6 border-b pb-2">1. Basic Components</Text>
                    <Stack gap={6}>
                        <div>
                            <Text variant="h4" className="mb-4">Button</Text>
                            <Stack direction="row" gap={4}>
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="danger">Danger</Button>
                            </Stack>
                        </div>
                        <div>
                            <Text variant="h4" className="mb-4">Image</Text>
                            <Image src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop" alt="Food" className="w-32 h-32" />
                        </div>
                    </Stack>
                </section>

                {/* 2. Layout Component */}
                <section className="mb-16">
                    <Text variant="h3" className="mb-6 border-b pb-2">2. Layout Components</Text>
                    <Text variant="h4" className="mb-4">Grid (2 Columns)</Text>
                    <Grid cols={2}>
                        <div className="bg-green-100 p-4 rounded-xl text-center">Col 1</div>
                        <div className="bg-green-100 p-4 rounded-xl text-center">Col 2</div>
                    </Grid>
                </section>

                {/* 3. Data Display Component */}
                <section className="mb-16">
                    <Text variant="h3" className="mb-6 border-b pb-2">3. Data Display Components</Text>
                    <Grid cols={2} gap={8}>
                        <div>
                            <Text variant="h4" className="mb-4">Card</Text>
                            <Card title="Order Details">
                                <Text>Here are some details about the recent order.</Text>
                            </Card>
                        </div>
                        <div>
                            <Text variant="h4" className="mb-4">List & Tooltip</Text>
                            <Tooltip text="These are list items">
                                <div>
                                    <List items={["Apples", "Bananas", "Oranges"]} />
                                </div>
                            </Tooltip>
                        </div>
                    </Grid>
                    
                    <div className="mt-8">
                        <Text variant="h4" className="mb-4">Table</Text>
                        <Table 
                            headers={["Name", "Role", "Status"]}
                            data={[
                                { Name: "John Doe", Role: "Admin", Status: "Active" },
                                { Name: "Jane Smith", Role: "User", Status: "Offline" }
                            ]}
                        />
                    </div>
                </section>

                {/* 4. Form Component */}
                <section className="mb-16">
                    <Text variant="h3" className="mb-6 border-b pb-2">4. Form Components</Text>
                    <Grid cols={2} gap={8}>
                        <Stack>
                            <Input label="Full Name" placeholder="John Doe" />
                            <Select label="Role" options={[{label: "Admin", value: "admin"}, {label: "User", value: "user"}]} />
                        </Stack>
                        <Stack>
                            <DatePicker label="Birth Date" />
                            <Checkbox label="I agree to terms and conditions" className="mt-2" />
                        </Stack>
                    </Grid>
                </section>

                {/* 5. Feedback Component */}
                <section className="mb-16">
                    <Text variant="h3" className="mb-6 border-b pb-2">5. Feedback Components</Text>
                    <Stack gap={6}>
                        <Alert title="Success!" message="Your profile has been updated." type="success" />
                        
                        <Stack direction="row" gap={4} align="center">
                            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                            <Button onClick={showToast} variant="outline">Show Toast</Button>
                            <Spinner />
                        </Stack>

                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sample Modal">
                            <Text>This is a modal content area.</Text>
                            <div className="mt-6 flex justify-end">
                                <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                            </div>
                        </Modal>

                        <Toast isVisible={isToastVisible} message="Action completed successfully!" />
                    </Stack>
                </section>

                {/* 6. Section Component */}
                <section className="mb-16">
                    <Text variant="h3" className="mb-6 border-b pb-2">6. Section Components</Text>
                    
                    <HeroSection 
                        title="Welcome to Sedap." 
                        subtitle="The most delicious admin dashboard template you'll ever use." 
                        ctaText="Get Started"
                    />

                    <FAQSection 
                        faqs={[
                            { question: "What is Sedap?", answer: "It is an admin dashboard." },
                            { question: "Is it free?", answer: "Yes, it is open source." }
                        ]}
                    />

                    <PricingSection 
                        plans={[
                            { name: "Basic", price: "$9", features: ["1 User", "Basic Support"], isPopular: false },
                            { name: "Pro", price: "$29", features: ["5 Users", "Premium Support", "Analytics"], isPopular: true },
                            { name: "Enterprise", price: "$99", features: ["Unlimited", "24/7 Support", "Custom features"], isPopular: false }
                        ]}
                    />
                </section>

            </Container>
            
            <div className="mt-12">
                <Footer copyright="Sedap Dashboard." />
            </div>
        </div>
    );
}
