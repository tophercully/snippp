import RoadmapDisplay from "../components/RoadmapDisplay";
import SubtleGridBackground from "../components/global/SubtleGridBackground";
import { Footer } from "../components/nav/Footer";
import { Navbar } from "../components/nav/Navbar";

export const PrivacyPolicy = () => {
  document.title = `Snippp - Privacy Policy`;

  return (
    <div className="flex h-fit min-h-[100vh] w-full max-w-[100vw] flex-col items-center gap-5 p-2 pt-32 md:p-10 md:pt-32 dark:text-white">
      <Navbar />
      <SubtleGridBackground />
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">
          Privacy Policy
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Last updated:{" "}
          <span className="font-medium text-gray-800">Nov 20, 2024</span>
        </p>

        <p className="mb-4 text-gray-700">
          Welcome to <span className="font-bold">Snippp.io</span>. We are
          committed to protecting your privacy and ensuring the security of your
          personal information. This Privacy Policy outlines how we collect,
          use, store, and safeguard your information when you visit our website
          <a
            href="/"
            className="ml-1 text-blue-600 underline"
          >
            [www.snippp.io]
          </a>{" "}
          ("Snippp") and use our code snippet toolkit services.
        </p>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            1. Information We Collect
          </h2>
          <ul className="ml-5 list-disc text-gray-700">
            <li>
              <strong>Personal Information:</strong> When you create an account,
              we may collect personal information such as your name, email
              address, and password.
            </li>
            <li>
              <strong>User-Generated Content:</strong> This includes code
              snippets, projects, and any other content you upload or create
              using our toolkit.
            </li>
            <li>
              <strong>Usage Data:</strong> We may collect information about how
              you access and use the Site, including your IP address, browser
              type, device information, and browsing actions.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            2. How We Use Your Information
          </h2>
          <ul className="ml-5 list-disc text-gray-700">
            <li>
              <strong>Providing Services:</strong> To operate and maintain our
              Site and provide you with access to your stored code snippets and
              related services.
            </li>
            <li>
              <strong>Account Management:</strong> To manage your account,
              including authentication, password management, and communication
              related to your account.
            </li>
            <li>
              <strong>Improving Services:</strong> To analyze usage patterns and
              improve the functionality and user experience of our Site.
            </li>
            <li>
              <strong>Security:</strong> To monitor for and protect against
              unauthorized access, breaches, or other security threats.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            3. Data Storage and Security
          </h2>
          <p className="text-gray-700">
            We store your data securely on our servers to ensure you can access
            your code snippets and related information whenever you need. We
            implement industry-standard security measures, including encryption,
            secure server infrastructure, and regular security assessments to
            protect your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            4. Data Sharing and Disclosure
          </h2>
          <ul className="ml-5 list-disc text-gray-700">
            <li>
              <strong>Third-Party Services:</strong> We may use third-party
              service providers to help operate our Site. These providers are
              obligated to protect your information and are prohibited from
              using it for any other purposes.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities (e.g., a court or government
              agency).
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of all or a portion of our assets, your
              information may be transferred as part of that transaction.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            5. Cookies and Tracking Technologies
          </h2>
          <p className="mb-2 text-gray-700">
            We use cookies and similar tracking technologies to enhance your
            experience on our Site. Cookies help us understand how you use our
            Site and allow us to provide features like remembering your login
            information.
          </p>
          <ul className="ml-5 list-disc text-gray-700">
            <li>
              <strong>Essential Cookies:</strong> Necessary for the basic
              functioning of the Site.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Help us understand how
              visitors interact with the Site.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> Enable enhanced
              functionality and personalization.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            6. Your Rights and Choices
          </h2>
          <p className="text-gray-700">
            You can access and update your personal information by logging into
            your account and modifying your profile settings. You may request
            the deletion of your account and all associated data by contacting
            us at
            <a
              href="mailto:snipppdotio@gmail.com"
              className="ml-1 text-blue-600 underline"
            >
              snipppdotio@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            7. Children's Privacy
          </h2>
          <p className="text-gray-700">
            Our Site is not intended for use by individuals under the age of 13.
            If we become aware that we have inadvertently received personal
            information from a child under 13, we will delete such information
            promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            8. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Your continued
            use of the Site after any changes constitutes your acceptance of the
            updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            9. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions, please contact us at:
          </p>
          <ul className="ml-0 list-none text-gray-700">
            <li>
              Email:{" "}
              <a
                href="mailto:snipppdotio@gmail.com"
                className="text-blue-600 underline"
              >
                snipppdotio@gmail.com
              </a>
            </li>
            <li>
              Mailing Address:{" "}
              <span className="text-gray-600">
                2501 Thornton Rd, Austin TX 78704
              </span>
            </li>
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  );
};
