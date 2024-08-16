import Marquee from 'react-marquee-slider';
import parse from 'html-react-parser';

interface AktualityMarqueeProps {
  aktuality: string[];
}

const AktualityMarquee: React.FC<AktualityMarqueeProps> = ({ aktuality }) => (
  <div className="bg-white p-2 mt-4 mb-8 border rounded-lg shadow-md">
    <Marquee
      velocity={20}
      direction="rtl"
      scatterRandomly={false}
      resetAfterTries={200}
      loop={0}
    >
      {aktuality.map((aktualita, index) => (
        <div
          key={index}
          className="mx-4 text-lg font-semibold text-black"
          style={{ whiteSpace: 'nowrap' }}
        >
          {parse(aktualita, {
            replace: (domNode) => {
              if (domNode.name === 'a') {
                domNode.attribs.style = (domNode.attribs.style || '') + 'color: #8e67ea;';
              }
            }
          })}
        </div>
      ))}
    </Marquee>
  </div>
);

export default AktualityMarquee;
