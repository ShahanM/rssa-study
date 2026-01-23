import {render, screen} from "@testing-library/react";
import StudyLayoutOne from "./StudyLayoutOne";


describe("StudyLayoutOne", () => {
	test("Renders with 2 MovieGallery elements.", () => {
		render(<StudyLayoutOne />);
		const galleryElements = screen.queryAllByTestId("gallery-container");
		expect(galleryElements.length).toBe(2);
	});
});