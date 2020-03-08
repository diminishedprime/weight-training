import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import * as hooks from "../hooks";
import * as t from "../types";

const useStyles = makeStyles((theme) => ({
  root: {
    "flex-grow": "1",
    "margin": theme.spacing(0.5, 0.5),
    "min-width": theme.spacing(15)
  },
  header: {
    "padding": theme.spacing(1),
    "text-align": "center"
  },
  media: {
    height: theme.spacing(8),
    width: theme.spacing(8),
    margin: "auto"
  },
  content: {
    "text-align": "center",
    "&:last-child": {
      padding: theme.spacing(1)
    }
  }
}));

interface LiftCardProps {
  liftType: t.LiftType;
  userDoc?: t.UserDoc;
  className?: string;
}

const LiftCard: React.FC<LiftCardProps> = ({
  liftType,
  userDoc,
  className
}) => {
  const {
    settings: { unit }
  } = hooks.useSettings();
  const classes = useStyles();

  return (
    <Link to={`/lift/${liftType}`}>
      <Card className={classnames(classes.root, className)}>
        <CardHeader
          className={classes.header}
          subheader={t.Metadata.forLiftType(liftType).displayText}
        />
        <CardMedia
          className={classes.media}
          image={t.Metadata.forLiftType(liftType).image}
        />
        {userDoc?.getORM(liftType).weight.greaterThan(t.Weight.zero()) && (
          <CardContent
            className={classes.content}
            classes={{ root: classes.content }}
          >
            <div className="bold has-text-primary">
              {userDoc.getORM(liftType).weight.display(unit)}
            </div>
            <div>
              {moment(userDoc.getORM(liftType).time.toDate()).calendar(
                undefined,
                {
                  lastDay: "[Yesterday]",
                  sameDay: "[Today]",
                  nextDay: "[Tomorrow]",
                  lastWeek: "[last] dddd",
                  nextWeek: "dddd",
                  sameElse: "L"
                }
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
};

export default LiftCard;
