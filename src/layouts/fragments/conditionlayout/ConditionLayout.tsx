import { Col, Container } from "react-bootstrap";
import HorizontalRibbon, { MovieRibbonProps } from "../../../widgets/movieribbon/MovieRibbon";

interface ConditionLayoutProps {
	ribbonConfigs: MovieRibbonProps[];
}

const ConditionLayout: React.FC<ConditionLayoutProps> = ({
	ribbonConfigs
}) => {
	return (
		<Container className="d-flex">
			{
				ribbonConfigs.map((config: MovieRibbonProps, i: number) => {
					return (
						<Col key={`ribbon-${i}`}>
							<HorizontalRibbon
								rows={config.rows}
								cols={config.cols} 
								header={config.header}
								movies={config.movies} />
						</Col>
					)
				})
			}

		</Container>
	)
}

export default ConditionLayout;