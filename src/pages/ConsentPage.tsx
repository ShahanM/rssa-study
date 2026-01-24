import React from 'react';
import { ConsentPage as GenericConsentPage } from 'rssa-study-template';

const ConsentContent: React.FC = () => {
    return (
        <div className="p-4 text-left space-y-4">
             <div>
                <h3 className="text-xl font-bold mb-2">Incentives</h3>
                <p>
                    Participants who complete all tasks will be compensated
                    with $2.75. Successful and careful completion of the tasks
                    is a prerequisite for payment.
                </p>
            </div>

            <div>
                 <h3 className="text-xl font-bold mb-2 text-gray-800">Audio/Video Recording and Photographs</h3>
                <p>This session will not be recorded.</p>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Protection of Privacy and Confidentiality</h3>
                <p>
                    No identifiable information will be collected during the study.
                    The anonymous information collected in this study could be used
                    for future research studies or distributed to another
                    investigator for future research studies without additional
                    informed consent from the participants or legally authorized
                    representative.
                </p>
                <p className="mt-2">
                    The results of this study may be published in scientific
                    journals, professional publications, or educational
                    presentations. Published results will not include
                    identifiable information.
                </p>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Contact Information</h3>
                <p>
                    If you have any questions or concerns about your rights in this research study,
                    please contact the Clemson University Office of Research Compliance (ORC) at
                    864-656-0636 or <a href="mailto:irb@clemson.edu" className="text-blue-600 hover:underline">irb@clemson.edu</a>. If you are
                    outside of the Upstate South Carolina area, please use the ORC's toll-free number,
                    866-297-3071. The Clemson IRB will not be able to answer some study-specific
                    questions. However, you may contact the Clemson IRB if the research staff cannot
                    be reached or if you wish to speak with someone other than the research staff.
                </p>
                <p className="mt-2">
                    If you have any study related questions or if any problem arise, please contact
                    Lijie <a href="mailto:lydiahsu7@gmail.com" className="text-blue-600 hover:underline">lydiahsu7@gmail.com</a>.
                </p>
            </div>

             <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Consent</h3>
                <p className="font-medium mb-4">
                    By participating in the study, you indicate that you have
                    read the information written above, been allowed to ask any
                    questions, and you are voluntarily choosing to take part in
                    this research.
                </p>
            </div>
        </div>
    );
};

const ConsentPage: React.FC = () => {
    return (
        <GenericConsentPage 
            itemTitle="" 
            title="Informed Consent"
        >
             <ConsentContent />
        </GenericConsentPage>
    );
};

export default ConsentPage;
